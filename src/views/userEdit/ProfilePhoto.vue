<template>
  <v-container>
    <v-card class="mx-auto" max-width="200">
      <v-img :src="model.photoURL" max-width="200px" max-height="300px" />
      <v-card-text class="pt-6" style="position: relative;">
        <v-btn absolute color="info" class="white--text" fab medium right top>
          <v-icon>mdi-camera</v-icon>
        </v-btn>
      </v-card-text>
      <v-card-title class="text-capitalize">
        {{ model.name | capitalize }}
        <br />
        {{ model.lastname1 | capitalize }}
        <br />
        {{ model.lastname2 | capitalize }}
      </v-card-title>
    </v-card>
  </v-container>
</template>
<script src="./profilePhoto.comp.js" />
