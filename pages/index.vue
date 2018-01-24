
<template>
<div id="app" class="container">
  <!-- Header -->
  <section class="hero">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">Arenavision Offline</h1>
        <h2 class="subtitle">Todo el deporte, en un click</h2>
      </div>
    </div>
  </section>

  <!-- Form -->
  <div class="field has-addons">
    <!-- Sport -->
    <div class="control">
      <div class="select">
        <select @change="updateSelComp" v-model="sport">
          <option value="">Selecciona Deporte</option>
          <option v-for="curSport in sports" :value="curSport">{{initCap(curSport)}}</option>
        </select>
      </div>
    </div>

    <!-- Competition -->
    <div class="control">
      <div class="select">
        <select @change="filterResult(text)" v-model="competition">
          <option value="">Selecciona Competición</option>
          <option v-for="curComp in selComp" :value="curComp">{{initCap(curComp)}}</option>
        </select>
      </div>
    </div>

    <!-- Input Text -->
    <div class="control is-expanded">
      <input type="text" placeholder="Buscar evento" v-model="text" @keyup="filterResult(text)" class="input">
    </div>

    <!-- Add to favorites -->
    <p class="control" @click="addToFavorites">
      <a class="button is-primary">
        Favorito
      </a>
    </p>
  </div>

  <!-- Tag with favorites -->
  <div class="tags has-addons">
    <template v-for="(elem, index) in fav">
      <span  class="tag is-warning"> {{initCap(elem.sport)}} - {{initCap(elem.competition)}} - {{initCap(elem.query)}}</span>
      <a @click="deleteFav(index)" class="tag is-delete"></a>
      &nbsp;
    </template>
  </div>

  <!-- Table of contents -->
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
      <tr v-for="event in showing" :class="{'is-selected': event.highlight} ">
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
import { filter, includes, each, uniq, map } from 'lodash'

export default {
  async asyncData({ req, params }) {
    const { data } = await axios.get('https://av-offline.firebaseio.com/.json')

    // Copy the data
    let shows = data.guide
    let channels = data.channels

    // Link each show with their channels
    each(shows, show => {
      show.links = {}
      each(show.channels, (lang, channel) => {
        if (channels[channel]) {
          show.links[channels[channel]] = lang;
        }
      })
    })

    // Obtain the unique sports and its competitions
    const sports = uniq(map(shows, 'sport'))
    const competitions = {}
    each(sports, sport => {
      const competition = filter(shows, show => show.sport == sport)
      competitions[sport] = uniq(map(competition, 'competition'))
    })

    return {
      events: shows,
      showing: shows,
      channels: data.channels,
      sports: sports,
      competitions: competitions
    }
  },
  head: {
    title: 'Arenavision Offline'
  },
  data() {
    return {
      text: "",
      sport: "",
      competition: "",
      selComp: [],
      fav: []
    }
  },
  mounted () {
    this.fav = this.getFav() || [];
    this.updateCollections();
  },
  methods: {
    getFav () {
      return JSON.parse(localStorage.getItem("fav"));
    },
    updateFav() {
      localStorage.setItem("fav", JSON.stringify(this.fav));
      this.updateCollections();
    },
    deleteFav (index) {
      this.fav.splice(index, 1)
      this.updateFav();
    },
    // Update the Competition combo based on the Sport combo
    addToFavorites () {
      if(this.sport == "" && this.competition == "" && this.text == ""){
        return false;
      }
      this.fav.push({sport: this.sport, competition: this.competition, query: this.text})
      this.updateFav();
    },
    updateSelComp () {
      this.selComp = this.sport == "" ? [] : this.competitions[this.sport];
      this.competition = ""
      this.filterResult(this.text);
    },
    filterResult(text) {
      this.showing = filter(this.events, event => {
        let res = true;

        if(this.sport != ""){
          res = includes(event.sport, this.sport)
        }

        if(res && this.competition != "") {
          res = includes(event.competition, this.competition)
        }

        return res  && includes(event.event.toLowerCase(), text.toLowerCase());
      });
    },
    initCap(str) {
      return str.toLowerCase().replace(/(?:^|\s)[a-z]/g, function(m) {
        return m.toUpperCase();
      });
    },
    updateCollections(){
      this.updateCollectionFav(this.events)
      this.updateCollectionFav(this.shows);
    },
    updateCollectionFav(collection){
      each(collection, event => {
        event.highlight = false;
        each(this.fav, elem => {
          if(event.sport == elem.sport && event.competition == elem.competition && includes(event.event.toLowerCase(), elem.query.toLowerCase())){
            event.highlight = true
          }
        })
      })
    }
  }
}
</script>
