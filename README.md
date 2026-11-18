# Cantina Bar Drill: Firebase setup

A menu trainer for Corrochio's Cantina plus the top 50 classic cocktails. It has accounts (email and password, or Google), password reset, email verification, account deletion, and progress that syncs across devices and works offline once loaded.

Everything here runs on Firebase's free **Spark** plan, with no card needed.

## What's in the folder

```
bar-drill/
├── public/
│   ├── index.html           the app
│   └── firebase-config.js   ← paste your config here
├── firebase.json            hosting settings
└── firestore.rules          database security rules
```

## 1. Create the Firebase project (about 5 min)

1. Go to https://console.firebase.google.com and click **Create a project**. Name it something like `cantina-bar-drill`. You can turn off Google Analytics.
2. In the project, click the **</>** (Web) icon to add a web app. Give it a nickname and leave "Firebase Hosting" unticked. You'll set that up from the command line instead.
3. Copy the `firebaseConfig` values it shows you into `public/firebase-config.js`, replacing every `PASTE_…` value.

## 2. Turn on sign-in

1. Go to **Build → Authentication → Get started**.
2. On the **Sign-in method** tab, enable **Email/Password**. Leave "Email link" off.
3. Enable **Google**, pick a support email and save.
4. Optional: under **Templates**, change the sender name and wording of the password-reset and verification emails, for example to "Cantina Bar Drill".

## 3. Create the database

1. Go to **Build → Firestore Database → Create database**.
2. Choose the location **europe-west2 (London)**. You can't change this later.
3. Start in **production mode**. The rules file in this folder replaces the default rules when you deploy.

## 4. Deploy

You need Node.js installed. Then, in a terminal:

```bash
npm install -g firebase-tools
firebase login
cd bar-drill
firebase use --add            # pick your project, alias it "default"
firebase deploy
```

Your app will be live at `https://<project-id>.web.app`. Open it on your phone and use **Share → Add to Home Screen** so it opens like an app.

To deploy changes later, run `firebase deploy` again.

## Testing locally (optional)

```bash
cd bar-drill
npx serve public
```

Sign-in works on `localhost` by default. If you use a custom domain later, add it under **Authentication → Settings → Authorized domains**.

## How it works

- **Data:** each person's menu edits, quiz progress and settings are stored in a single document at `users/{uid}`. The rules only let a signed-in person read and write their own document.
- **Offline:** after your first sign-in on a device, the app works without signal and syncs when you reconnect. If a device has never loaded your data and you're offline, the app won't start with a blank menu, because that could overwrite your saved progress.
- **Moving from the Claude version:** the first time you sign in on a browser where you used the old version, your edits and progress there are copied into your account.
- **Password reset:** use "Forgot password?" on the sign-in screen, or "Change password" in Manage. Both send a reset link by email. For privacy, the app never reveals whether an email has an account.
- **The config isn't secret:** the Firebase web config is meant to be public. Security comes from Authentication and the Firestore rules.

## Free-tier limits

Spark includes 50k reads and 20k writes a day on Firestore, plus 10 GB of hosting transfer a month. A whole bar team using this daily would use a tiny fraction of that.
