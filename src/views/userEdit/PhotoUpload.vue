<template>
  <v-container>
    <v-row>
      <v-col sm="12" md="6">
        <v-file-input
          v-model="imgValue"
          :disabled="uploadLoading"
          :loading="uploadLoading"
          accept="image/*"
          label="Archivo de imagen"
          dense
          show-size
        ></v-file-input>
        <cropper
          :src="url"
          :stencil-props="{
            aspectRatio: 2 / 3,
          }"
          @change="change"
        ></cropper>
        <v-btn
          v-if="imgValue"
          :disabled="uploadLoading"
          :loading="uploadLoading"
          block
          outlined
          color="success"
          small
          @click="uploadPhoto(imgValue)"
        >
          <v-icon>mdi-cloud-upload</v-icon>

          <template v-slot:loader>
            <span>Cargando archivo</span>
          </template>
        </v-btn>
      </v-col>
      <v-col v-if="imgValue" sm="12" md="6">
        <v-img ref="photo" max-height="300" max-width="200" :src="result" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script src="./photoUpload.comp.js" />
