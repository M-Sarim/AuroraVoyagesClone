import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import api from "../../utils/api";

// Load Stripe outside of component render to avoid recreating Stripe object on every render
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ amount, onSuccess, onError, bookingData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Determine booking type (package or destination)
      const bookingType = bookingData.bookingType || "package";

      // Create payment intent on the server
      const { data: clientSecret } = await api.post(
        "/payments/create-payment-intent",
        {
          amount,
          currency: "usd",
          bookingData: {
            ...bookingData,
            bookingType,
          },
        }
      );

      // Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: bookingData.name,
            email: bookingData.email,
          },
        },
        receipt_email: bookingData.email,
      });

      if (result.error) {
        setError(result.error.message);
        onError && onError(result.error);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          onSuccess && onSuccess(result.paymentIntent);
        }
      }
    } catch (err) {
      setError(err.message || "An error occurred during payment processing");
      onError && onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border border-gray-300 rounded-md">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
      >
        {loading ? "Processing..." : `Pay $${(amount / 100).toFixed(2)}`}
      </button>
    </form>
  );
};

const StripeCheckout = ({ amount, onSuccess, onError, bookingData }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        amount={amount}
        onSuccess={onSuccess}
        onError={onError}
        bookingData={bookingData}
      />
    </Elements>
  );
};

export default StripeCheckout;
