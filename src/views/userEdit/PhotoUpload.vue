<template>
  <v-container>
    <v-row>
      <v-col sm="12" md="12">
        <v-btn
          v-if="imgValue"
          :disabled="uploadLoading"
          :loading="uploadLoading"
          color="success"
          large
          block
          @click="uploadPhoto(imgValue)"
        >
          <v-icon>mdi-cloud-upload</v-icon>
        </v-btn>
      </v-col>
      <v-col sm="12" md="12">
        <v-file-input
          v-model="imgValue"
          :disabled="uploadLoading"
          :loading="uploadLoading"
          accept="image/*"
          label="Archivo de imagen"
          dense
          show-size
        ></v-file-input>
      </v-col>
      <v-col sm="12" md="6">
        <cropper
          :src="url"
          stencil-component="circle-stencil"
          background-class="cropper-background"
          @change="change"
        />
      </v-col>
      <v-col class="d-none d-sm-none d-md-flex" sm="12" md="6">
        <v-img ref="photo" max-height="300" max-width="200" :src="result" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script src="./photoUpload.comp.js" />
<style scoped>
.cropper {
  max-height: 300px;
}
.cropper-wrapper {
  overflow: hidden;
  position: relative;
  height: 400px;
  background: black;
}
.cropper-background {
  background: none;
}
.image-background {
  position: absolute;
  width: calc(100% + 20px);
  height: calc(100% + 20px);
  left: -10px;
  top: -10px;
  background-size: cover;
  background-position: 50%;
  filter: blur(5px);
}
</style>
