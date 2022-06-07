<template>
  <v-container fill-height>
    <v-row>
      <v-col cols="4">
        <v-card outlined>
          <v-list v-for="n in 10" :key="`${n}-list-item`">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-list-item v-on="on">
                  <v-list-item-icon>
                    <v-icon :color="n <= 4 ? 'error' : ''">
                      {{ n > 4 ? 'mdi-email-open' : 'mdi-email-alert' }}
                    </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content class="hidden-sm-and-down">
                    Tittle of the message {{ n }}
                  </v-list-item-content>
                </v-list-item>
              </template>
              <span>Title of message {{ n }}</span>
            </v-tooltip>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-card outlined>
          <v-card-title>
            <v-avatar>
              <v-icon>mdi-account</v-icon>
            </v-avatar>
            <small>Admin</small>
            <v-spacer></v-spacer>
            2022 06 06 17.55
          </v-card-title>
          <v-card-title>
            Title of message 5
          </v-card-title>
          <v-card-text>
            <v-sheet class="py-3">
              <a>Link to the message 5 enclosed document</a>
            </v-sheet>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Suscipit
            nostrum dicta nobis illum odio quam velit voluptatem exercitationem
            obcaecati expedita sint perspiciatis, incidunt ducimus dolor id
            error delectus non nulla. Lorem ipsum dolor sit amet consectetur,
            adipisicing elit. Suscipit nostrum dicta nobis illum odio quam velit
            voluptatem exercitationem obcaecati expedita sint perspiciatis,
            incidunt ducimus dolor id error delectus non nulla.
          </v-card-text>
          <v-card-actions>
            <v-row>
              <v-col cols="6" sm="12" xs="12">
                <v-btn block outlined color="red" dark>
                  <v-icon>mdi-delete</v-icon>
                  <span v-show="!$vuetify.breakpoint.xs">
                    {{ $t('actions.delete') }}
                  </span>
                </v-btn>
              </v-col>
              <v-col cols="6" sm="12" xs="12">
                <v-btn block outlined color="green" dark>
                  <v-icon>mdi-email</v-icon>
                  <span v-show="!$vuetify.breakpoint.xs">
                    {{ $t('actions.markUnread') }}
                  </span>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
