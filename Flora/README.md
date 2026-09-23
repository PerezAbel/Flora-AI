# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Farm AI and nearby care

The Farm AI tab includes symptom entry, camera/gallery attachments, and general
care guidance for plants and animals. This screen does not call the
existing random demo inference service. Photos are not analyzed; guidance is not
a diagnosis or prescription. A validated diagnosis service is still needed for
individual treatment recommendations, treatment durations, and urgency estimates.
Guidance cards link to their reference sources.

Photo selection and symptom submission reveal care guidance and professional
referrals directly in the results. The side menu contains only **Scan History**
and **Chat History**. New photo previews and symptom conversations are saved for
the current app session; they do not persist after restarting the app.

Open **Nearby Care** from the bottom navigation or a result's referral button to
browse practice cards and service details. Filter by town, practice type or service.
Example cards are explicitly labeled and cannot be called. **Add your practice**
creates a session listing with contact details, services, hours, fees and farm-visit
options. **My listings** supports editing and confirmed removal. Listings are held
in app context only, are not verified, and are not published to other farmers.
A shared backend and authentication are needed for a persistent public directory.
Google Maps search remains available for finding real providers outside the app;
the directory does not compute proximity or claim live availability.

## Marketplace checkout

Add products in Shop, open the cart, and select **Proceed to checkout**. Checkout
includes an order summary, delivery details, and M-Pesa, PayPal, Visa, and
Mastercard options. It currently runs in demo mode: **Simulate payment** validates
the form, displays a temporary demo receipt, and clears the session cart. It does
not charge money, contact a provider, or submit an order. Prices remain in USD.

Live payments require a merchant provider and backend integration for order
pricing, payment creation, and verified payment confirmation before fulfillment.
Do not add merchant secrets or collect raw card details in the mobile app.

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
