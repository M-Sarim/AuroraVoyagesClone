import express from "express";
import Destination from "../models/Destination.js";
import { auth } from "../middleware/auth.js";
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const router = express.Router();
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const LOCATIONIQ_API_KEY = process.env.LOCATIONIQ_API_KEY;

// Get map data for a specific region
router.get("/region/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Get destination details
    const destination = await Destination.findById(id);

    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    // Get coordinates
    const latitude = destination.coordinates?.latitude || 35.3753;
    const longitude = destination.coordinates?.longitude || 75.1755;

    // Fetch static map data for offline use
    const mapData = {
      id: destination._id,
      name: destination.name,
      center: {
        lat: latitude,
        lng: longitude,
      },
      zoom: 10,
      // Include basic map data for offline use
      staticMapUrl: `https://maps.locationiq.com/v3/staticmap?key=${LOCATIONIQ_API_KEY}&center=${latitude},${longitude}&zoom=10&size=600x400&format=png&markers=icon:large-red-cutout|${latitude},${longitude}`,
      // Include points of interest if available
      pointsOfInterest: destination.attractions.map((attraction, index) => ({
        id: `poi-${index}`,
        name: attraction,
        // Generate random coordinates near the destination center for demo purposes
        // In a real app, these would come from a proper POI database
        position: {
          lat: latitude + (Math.random() - 0.5) * 0.05,
          lng: longitude + (Math.random() - 0.5) * 0.05,
        },
      })),
    };

    res.status(200).json(mapData);
  } catch (error) {
    console.error("Get map data error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get map data for multiple regions
router.post("/regions", auth, async (req, res) => {
  try {
    const { destinationIds } = req.body;

    if (
      !destinationIds ||
      !Array.isArray(destinationIds) ||
      destinationIds.length === 0
    ) {
      return res.status(400).json({ message: "Destination IDs are required" });
    }

    // Get destinations
    const destinations = await Destination.find({
      _id: { $in: destinationIds },
    });

    if (destinations.length === 0) {
      return res.status(404).json({ message: "No destinations found" });
    }

    // Prepare map data for each destination
    const mapDataArray = destinations.map((destination) => {
      const latitude = destination.coordinates?.latitude || 35.3753;
      const longitude = destination.coordinates?.longitude || 75.1755;

      return {
        id: destination._id,
        name: destination.name,
        center: {
          lat: latitude,
          lng: longitude,
        },
        zoom: 10,
        staticMapUrl: `https://maps.locationiq.com/v3/staticmap?key=${LOCATIONIQ_API_KEY}&center=${latitude},${longitude}&zoom=10&size=600x400&format=png&markers=icon:large-red-cutout|${latitude},${longitude}`,
        pointsOfInterest: destination.attractions.map((attraction, index) => ({
          id: `poi-${index}`,
          name: attraction,
          position: {
            lat: latitude + (Math.random() - 0.5) * 0.05,
            lng: longitude + (Math.random() - 0.5) * 0.05,
          },
        })),
      };
    });

    res.status(200).json(mapDataArray);
  } catch (error) {
    console.error("Get multiple map data error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get directions between two points
router.get("/directions", async (req, res) => {
  try {
    const { origin, destination, mode = "driving" } = req.query;

    if (!origin || !destination) {
      return res
        .status(400)
        .json({ message: "Origin and destination are required" });
    }

    console.log(
      `Getting directions from ${origin} to ${destination} via ${mode}`
    );
    console.log(
      `LocationIQ API key: ${LOCATIONIQ_API_KEY ? "Present" : "Missing"}`
    );

    // Check if LocationIQ API key is configured
    if (!LOCATIONIQ_API_KEY) {
      console.error("LocationIQ API key is not configured");
      return res
        .status(500)
        .json({ message: "LocationIQ API key is not configured" });
    }

    // Convert mode to LocationIQ format
    const locationIQMode =
      mode === "walking" ? "walking" : mode === "bicycling" ? "cycling" : "driving";

    // Extract lat/lng from coordinates
    let originLat, originLng, destLat, destLng;

    if (/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(origin)) {
      [originLat, originLng] = origin.split(",");
    } else {
      // Default to Peshawar if format is invalid
      console.log("Invalid origin format, using default");
      originLat = "34.0151";
      originLng = "71.5249";
    }

    if (/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(destination)) {
      [destLat, destLng] = destination.split(",");
    } else {
      // Default to Skardu if format is invalid
      console.log("Invalid destination format, using default");
      destLat = "35.3";
      destLng = "75.6";
    }

    // Use the direct URL format that LocationIQ recommends
    // Format: https://us1.locationiq.com/v1/directions/driving/lng,lat;lng,lat?key=YOUR_KEY&steps=true&alternatives=true&geometries=polyline&overview=full

    // Construct the coordinates part of the URL (lng,lat;lng,lat)
    const coordinatesPath = `${originLng},${originLat};${destLng},${destLat}`;

    // Construct the full URL
    const requestUrl = `https://us1.locationiq.com/v1/directions/${locationIQMode}/${coordinatesPath}`;

    // Prepare request parameters
    const requestParams = {
      key: LOCATIONIQ_API_KEY,
      steps: true,
      alternatives: false,
      geometries: "geojson", // Using geojson for better compatibility with our frontend
      overview: "full"
    };

    console.log(`Making request to: ${requestUrl}`);
    console.log(`With params:`, requestParams);

    // Call LocationIQ Directions API
    let response;
    try {
      response = await axios.get(requestUrl, { params: requestParams });
      console.log(
        `LocationIQ Directions API response received with status: ${response.status}`
      );
    } catch (error) {
      console.error("Error calling LocationIQ API:", error.message);

      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }

      // Try with the EU1 endpoint as a fallback
      console.log("Trying with EU1 endpoint as fallback...");
      const fallbackUrl = `https://eu1.locationiq.com/v1/directions/${locationIQMode}/${coordinatesPath}`;

      try {
        response = await axios.get(fallbackUrl, { params: requestParams });
        console.log(
          `Fallback request successful with status: ${response.status}`
        );
      } catch (fallbackError) {
        console.error("Fallback request also failed:", fallbackError.message);
        if (fallbackError.response) {
          console.error("Fallback response status:", fallbackError.response.status);
          console.error("Fallback response data:", fallbackError.response.data);
        }
        throw error; // Throw the original error
      }
    }

    // Check if we have routes in the response
    if (
      response &&
      response.data &&
      response.data.routes &&
      response.data.routes.length > 0
    ) {
      console.log(
        `Found ${response.data.routes.length} routes in the response`
      );
    } else {
      console.log(`No routes found in the response:`, response.data);
    }

    if (
      !response ||
      !response.data ||
      !response.data.routes ||
      response.data.routes.length === 0
    ) {
      console.error(`LocationIQ Directions API error: No routes found`);
      return res.status(400).json({
        message: "Could not get directions",
        error: "No routes found",
      });
    }

    // Transform LocationIQ response to a format similar to Google's for compatibility
    const route = response.data.routes[0];
    const legs = route.legs || [];

    const transformedResponse = {
      status: "OK",
      routes: [
        {
          legs: legs.map((leg) => ({
            distance: {
              text: `${(leg.distance / 1000).toFixed(1)} km`,
              value: leg.distance,
            },
            duration: {
              text: `${Math.round(leg.duration / 60)} mins`,
              value: leg.duration,
            },
            steps: (leg.steps || []).map((step) => ({
              distance: {
                text: `${(step.distance / 1000).toFixed(1)} km`,
                value: step.distance,
              },
              duration: {
                text: `${Math.round(step.duration / 60)} mins`,
                value: step.duration,
              },
              html_instructions:
                step.maneuver?.instruction || step.name || "Continue",
              travel_mode: mode.toUpperCase(),
              maneuver: step.maneuver?.type || "",
              start_location: {
                lat: step.geometry?.coordinates[0][0],
                lng: step.geometry?.coordinates[0][1],
              },
              end_location: {
                lat: step.geometry?.coordinates[
                  step.geometry.coordinates.length - 1
                ][0],
                lng: step.geometry?.coordinates[
                  step.geometry.coordinates.length - 1
                ][1],
              },
              polyline: {
                points: step.geometry?.coordinates || [],
              },
            })),
            start_address: "Starting Point",
            end_address: "Destination",
            start_location: {
              lat: legs[0]?.steps[0]?.geometry?.coordinates[0][0],
              lng: legs[0]?.steps[0]?.geometry?.coordinates[0][1],
            },
            end_location: {
              lat: legs[0]?.steps[legs[0].steps.length - 1]?.geometry
                ?.coordinates[0][0],
              lng: legs[0]?.steps[legs[0].steps.length - 1]?.geometry
                ?.coordinates[0][1],
            },
          })),
          overview_polyline: {
            points: route.geometry?.coordinates || [],
          },
          summary: route.summary || "Route",
          warnings: [],
          waypoint_order: [],
        },
      ],
      geocoded_waypoints: [
        { geocoder_status: "OK", place_id: "origin", types: ["point"] },
        { geocoder_status: "OK", place_id: "destination", types: ["point"] },
      ],
      // Include the original LocationIQ response for reference
      locationiq_response: response.data,
    };

    // Return directions data
    res.status(200).json(transformedResponse);
  } catch (error) {
    console.error("Get directions error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
