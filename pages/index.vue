
<template>
  <div id="app" class="container">
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Arenavision Offline</h1>
          <h2 class="subtitle">Todo el deporte, en un click</h2>
        </div>
      </div>
    </section>
    <div class="field">
      <div class="control is-large">
        <input type="text" placeholder="Buscar evento" v-model="text" @keyup="search" class="input is-large">
      </div>
    </div>
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Deporte</th>
          <th class="is-hidden-mobile">Competición</th>
          <th>Evento</th>
          <th>Enlaces</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="event in showing">
          <td>{{event.day.substr(0, 5)}} - {{event.time.substr(0, 5)}}</td>
          <td>{{initCap(event.sport)}}</td>
          <td>{{initCap(event.competition)}}</td>
          <td>{{initCap(event.event)}}</td>
          <td>
            <a v-for="(lang, link) in event.links" :href="link">
              <span class="tag is-info is-rounded">{{lang}}</span>
              &nbsp;
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'
import { filter, includes, each } from 'lodash'

export default {
   async asyncData({ req, params }) {
     const { data } = await axios.get('https://av-offline.firebaseio.com/.json')

     let shows = data.guide
     let channels = data.channels

     each(shows, show => {
       show.links = {}
       each(show.channels, (lang, channel) => {
         if(channels[channel]){
           show.links[channels[channel]] = lang;
         }
       })
     })

      return {
        events: shows,
        showing: shows,
        channels: data.channels,
        text: ""
      }
   },
  head: {
    title: 'Arenavision Offline'
  },
  methods: {
    search () {
      this.showing = filter(this.events, event => {
        return includes(event.competition.toLowerCase(), this.text.toLowerCase())
                || includes(event.event.toLowerCase(), this.text.toLowerCase())
                || includes(event.sport.toLowerCase(), this.text.toLowerCase())
      })
    },
    initCap(str) {
       return str.toLowerCase().replace(/(?:^|\s)[a-z]/g, function (m) {
          return m.toUpperCase();
       });
    }
  }
}
</script>
