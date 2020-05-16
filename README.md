# Arenavision Mirror _(DEPRECATED)_
As Arenavision has lots of ads, popups, miner scripts and is a nightmare to look up for anything in the web, I build this mirror to show the same information as in the Arenavision site, but in a clean way.

The data displayed in this mirror comes from scraping its web with the [arenavision-scraper](https://github.com/Dionakra/arenavision-scraper) node package that I built for myself. This information would be stored in Firebase Realtime Database and updated every hour and, with this, the page would generate a Static version of it (so Firebase Realtime Database didn't get too much traffic). With this approach we kept the website updated, with a small bundle size and the DB was not used very often, as it has harder usage limits than Firebase Hosting, which was the hosting option when this web was live.

Now that the library that I built has been deprecated, that means that the mirror is no longer updated, so it is not necessary anymore, that's why this repository is archived and with subtle changes compared to the original version.

The original version of this mirror was hosted in Firebase, it retrieved data from Firebase Realtime Database and its information was updated by a scheduled functions set up in Firebase Functions. As this project is no longer useful, I am switching off the Firebase Project, as Firebase has limitations on active projects. Therefore, I moved the hosting to GitHub Pages, moved the DB to a static JSON file so it could mimic its original workflow and deleted the Firebase project.

If you want to check out how it looked, please go visit [av.boix.dev](https://av.boix.dev/)

## Built with
* [NuxtJS](https://nuxtjs.org/) - Vue Framework capable of generating static HTML pages with a dynamic source like a Database.
* [Firebase](https://firebase.google.com/) - Google Platform capable of lot of things. In my case, I used Firebase Realtime Database for data storage, Firebase Hosting for hosting it and Firebase Functions to update hourly the data consumed from the web.
* [Bulma](https://bulma.io/) - CSS only framework. Very simple to use.
* [Arenavision Scraper](https://github.com/Dionakra/arenavision-scraper) - Node library to extract the important information from Arenavision.
