<template>
  <div>
    <div class="pac-card" id="pac-card">
      <div id="pac-container">
        <input id="pac-input" v-model="myplace" type="text" placeholder="Ingresa una ubicación">
      </div>
    </div>
    <div class="google-map" ref="googleMap"></div>
    <template v-if="Boolean(this.google) && Boolean(this.map)">
      <slot :google="google" :map="map"></slot>
    </template>
  </div>
</template>
<script>
import GoogleMapsApiLoader from "google-maps-api-loader";

export default {
  data() {
    return {
      myplace:null,
      google: null,
      map: null
    };
  },

  async mounted() {
    console.log(process.env)
    const googleMapApi = await GoogleMapsApiLoader({
      libraries: ["places"],
      apiKey: process.env.VUE_APP_MAPS_KEY
    });
    this.google = googleMapApi;
    this.initializeMap();
  },

  methods: {
    initializeMap() {
      const mapContainer = this.$refs.googleMap;
      this.map = new this.google.maps.Map(mapContainer, {
        center: { lat: 3.45, lng: -76.5246895 },
        zoom: 13,
        clickableIcons: false,
        streetViewControl: false,
        panControlOptions: false,
        mapTypeControl: false,
        zoomControlOptions: {
          style: "small"
        }
      });
      var card = document.getElementById("pac-card");
      var input = document.getElementById("pac-input");

      this.map.controls[this.google.maps.ControlPosition.TOP_RIGHT].push(card);
      var autocomplete = new this.google.maps.places.Autocomplete(input);
      autocomplete.bindTo("bounds", this.map);

      var infowindow = new this.google.maps.InfoWindow();
      var infowindowContent = document.getElementById("infowindow-content");
      infowindow.setContent(infowindowContent);
      var marker = new this.google.maps.Marker({
        map: this.map,
        anchorPoint: new this.google.maps.Point(0, -29)
      });

      autocomplete.addListener("place_changed", () => {
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
          window.alert("No details available for input: '" + place.name + "'");
          return;
        }
        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          this.map.fitBounds(place.geometry.viewport);
        } else {
          this.map.setCenter(place.geometry.location);
          this.map.setZoom(17); // Why 17? Because it looks good.
        }
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
        this.$emit("place", place);
      });
    }
  },
  props: {
    lugar: String
  },
  watch:{
    lugar(val){
      this.myplace = val
    }
  }
};
</script>

<style scoped>
/* Always set the map height explicitly to define the size of the div
       * element that contains the map. */
#map {
  height: 100%;
}
/* Optional: Makes the sample page fill the window. */
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
#description {
  font-family: Roboto;
  font-size: 15px;
  font-weight: 300;
}

#infowindow-content .title {
  font-weight: bold;
}

#infowindow-content {
  display: none;
}

#map #infowindow-content {
  display: inline;
}

.pac-card {
  margin: 10px 10px 0 0;
  border-radius: 2px 0 0 2px;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  outline: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  background-color: #fff;
  font-family: Roboto;
}

#pac-container {
  padding-top: 12px;
  padding-bottom: 12px;
  margin-right: 12px;
}

.pac-controls {
  display: inline-block;
  padding: 5px 11px;
}

.pac-controls label {
  font-family: Roboto;
  font-size: 13px;
  font-weight: 300;
}

#pac-input {
  background-color: #fff;
  font-family: Roboto;
  font-size: 15px;
  font-weight: 300;
  margin-left: 12px;
  padding: 0 11px 0 13px;
  text-overflow: ellipsis;
  width: 400px;
}

#pac-input:focus {
  border-color: #4d90fe;
}

#title {
  color: #fff;
  background-color: #4d90fe;
  font-size: 25px;
  font-weight: 500;
  padding: 6px 12px;
}
.google-map {
  width: 100%;
  min-height: 100%;
}
</style>