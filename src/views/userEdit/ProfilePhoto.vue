<template>
  <v-container>
    <v-card class="mx-auto" max-width="200" outlined>
      <v-img :src="model.photoURL" max-width="200px" max-height="300px" />
      <v-card-text class="pt-6" style="position: relative;">
        <v-btn
          absolute
          color="info"
          class="white--text"
          fab
          medium
          right
          top
          @click.stop="dialog = true"
        >
          <v-icon>mdi-pencil</v-icon>
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
    <v-dialog v-model="dialog" width="500px" max-height="800px">
      <v-card class="mx-auto" max-width="500px" max-height="800px">
        <v-app-bar color="primary" dark>
          <v-app-bar-title>Cambiar fotografía de perfil</v-app-bar-title>
          <v-spacer></v-spacer>
          <v-btn icon color="error" @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-app-bar>
        <photo-upload @done="dialog = false"></photo-upload>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script src="./profilePhoto.comp.js" />
