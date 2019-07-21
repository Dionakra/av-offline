
<template>
  <div id="app" class="container">
    <!-- Header -->
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Arenavision Mirror</h1>
        </div>
      </div>
    </section>

    <!-- Form -->
    <div class="columns is-gapless">
      <!-- Sport -->
      <div class="column is-2 is-12-mobile">
        <div class="select is-fullwidth">
          <select v-model="sport">
            <option value>Sport</option>
            <option
              v-for="curSport in sports"
              :value="curSport"
              :key="curSport"
            >{{curSport}}</option>
          </select>
        </div>
      </div>

      <!-- Competition -->
      <div class="column is-2 is-12-mobile">
        <div class="select is-fullwidth">
          <select  v-model="competition">
            <option value>Competition</option>
            <option v-for="curComp in competitions[sport]" :value="curComp" :key="curComp">{{curComp}}</option>
          </select>
        </div>
      </div>

      <!-- Input Text -->
      <div class="column is-7 is-12-mobile">
        <input
          type="text"
          placeholder="Search"
          v-model="text"
          class="input"
        />
      </div>
    </div>

    <!-- Table of contents -->
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th>Date</th>
          <th class="is-hidden-mobile">Sport</th>
          <th class="is-hidden-mobile">Competition</th>
          <th>Event</th>
          <th>Links</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(event, index) in eventsToShow()"
          :key="index"
        >
          <td>{{event.day.substr(0, 5)}} - {{event.time.substr(0, 5)}}</td>
          <td class="is-hidden-mobile">{{event.sport}}</td>
          <td class="is-hidden-mobile">{{event.competition}}</td>
          <td>{{event.event}}</td>
          <td>
            <a v-for="(channel, key) in event.channels" :href="channel.url.acestream" :key="key">
              <span class="tag is-info is-rounded">{{channel.lang}}</span>
              &nbsp;
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
String.prototype.initCap = function () {
   return this.toLowerCase().replace(/(?:^|\s)[a-z]/g, function (m) {
      return m.toUpperCase();
   });
};

export default {
  async asyncData({ $axios }) {
    const data = await $axios.$get("https://av-offline.firebaseio.com/events/.json");

    const events = data.map(e => {
      return {
        channels: e.channels, 
        competition: e.competition.initCap(),
        day: e.day, 
        event: e.event.initCap(), 
        sport: e.sport.initCap(),
        time: e.time
      }
    })

    const sportCompetitionMap = events.reduce(
      (r, v, i, a, k = v.sport) => (
        (r[k] || (r[k] = [])).push(v.competition), r
      ),
      {}
    );
    return {
      events: events,
      sports: Object.keys(sportCompetitionMap).sort(),
      competitions: sportCompetitionMap
    };
  },
  data() {
    return {
      text: "",
      sport: "",
      competition: ""
    };
  },
  methods: {
    eventsToShow() {
      return this.events.filter(event => {
        let res = true;

        if (this.sport != "") {
          res = event.sport === this.sport;
        }

        if (res && this.competition != "") {
          res = event.competition === this.competition;
        }

        return res && event.event.toLowerCase().includes(this.text.toLowerCase());
      });
    },
    initCap(str) {
      return str.toLowerCase().replace(/(?:^|\s)[a-z]/g, function(m) {
        return m.toUpperCase();
      });
    }
  }
};
</script>
