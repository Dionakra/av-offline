
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
  <div class="columns is-gapless">
    <!-- Sport -->
    <div class="column is-2 is-12-mobile" >
      <div class="select is-fullwidth">
        <select @change="updateSelComp" v-model="sport">
          <option value="">Selecciona Deporte</option>
          <option v-for="curSport in sports" :value="curSport" :key="curSport">{{initCap(curSport)}}</option>
        </select>
      </div>
    </div>

    <!-- Competition -->
    <div class="column is-2 is-12-mobile" >
      <div class="select is-fullwidth">
        <select @change="filterResult(text)" v-model="competition">
          <option value="">Selecciona Competición</option>
          <option v-for="curComp in selComp" :value="curComp" :key="curComp">{{initCap(curComp)}}</option>
        </select>
      </div>
    </div>

    <!-- Input Text -->
    <div class="column is-7 is-12-mobile" >
      <input type="text" placeholder="Buscar evento" v-model="text" @keyup="filterResult(text)" class="input">
    </div>

    <!-- Add to favorites -->
    <div class="column is-1 is-12-mobile" @click="addToFavorites">
      <a class="button is-primary is-fullwidth">
        Favorito
      </a>
    </div>
  </div>
  

  <!-- Tag with favorites -->
  <div class="tags has-addons">
    <template v-for="(elem, index) in fav" >
      <span  class="tag is-warning" :key="index"> {{initCap(elem.sport)}} - {{initCap(elem.competition)}} - {{initCap(elem.query)}}</span>
      <a @click="deleteFav(index)" class="tag is-delete" :key="index"></a>
      &nbsp;
    </template>
  </div>

  <!-- Table of contents -->
  <table class="table is-fullwidth">
    <thead>
      <tr>
        <th>Fecha</th>
        <th class="is-hidden-mobile">Deporte</th>
        <th class="is-hidden-mobile">Competición</th>
        <th>Evento</th>
        <th>Enlaces</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(event, index) in showing" :class="{'is-selected': event.highlight}" :key="index">
        <td>{{event.day.substr(0, 5)}} - {{event.time.substr(0, 5)}}</td>
        <td class="is-hidden-mobile">{{initCap(event.sport)}}</td>
        <td class="is-hidden-mobile">{{initCap(event.competition)}}</td>
        <td>{{initCap(event.event)}}</td>
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
import axios from 'axios'
import { filter, includes, each, uniq, map } from 'lodash'

export default {
  async asyncData({ req, params }) {
    const { data } = await axios.get('https://av-offline.firebaseio.com/events/.json')

    // Obtain the unique sports and its competitions
    const sports = uniq(map(data, 'sport'))
    const competitions = {}
    each(sports, sport => {
      const competition = filter(data, show => show.sport == sport)
      competitions[sport] = uniq(map(competition, 'competition'))
    })

    return {
      events: data,
      showing: data,
      sports: sports.sort(),
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
    this.filterResult("");
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
      this.selComp = this.sport == "" ? [] : this.competitions[this.sport].sort();
      this.competition = ""
      this.filterResult(this.text);
    },
    filterResult(text) {
      this.showing = filter(this.events, event => {
        let res = true;

        if(this.sport != ""){
          res = event.sport === this.sport
        }

        if(res && this.competition != "") {
          res = event.competition === this.competition
        }

        return res && includes(event.event.toLowerCase(), text.toLowerCase());
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
          let res = true;

          if(elem.sport != ""){
            res = includes(event.sport, elem.sport)
          }

          if(res && elem.competition != "") {
            res = includes(event.competition, elem.competition)
          }

          event.highlight = event.highlight || (res && includes(event.event.toLowerCase(), elem.query.toLowerCase()));
        })
      })
    },
    sort(coll){
      return coll.sort(this.sortByName)
    }
  }
}
</script>
