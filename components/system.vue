<template>
  <div class="tela">
    <div class="barraLateral">
      <div class="logo">
        <v-img src="https://i.ibb.co/vJYVw9C/sorting-hat-logo.png"></v-img>
      </div>
      <div class="botão">
        <v-dialog v-model="dialog" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark v-bind="attrs" x-large v-on="on">
              New System
            </v-btn>
          </template>
          <v-form>
            <v-card>
              <v-card-title>
                <span class="headline"> New System</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="name"
                        data-cy="nameTextField"
                        label="Name"
                        :error-messages="nameErrors"
                        required
                        @input="$v.name.$touch()"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="description"
                        label="Description"
                        data-cy="descriptionTextField"
                        required
                        :error-messages="descriptionErrors"
                        @input="$v.description.$touch()"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-container>
                <strong>Non Functional Requirements </strong>
              </v-container>
              <v-container class="requisitos" fluid>
                <v-checkbox
                  v-for="nonFuncReq in nonFuncReqs"
                  :key="nonFuncReq.id"
                  v-model="selected"
                  :label="nonFuncReq.nameReq"
                  :value="nonFuncReq.id"
                  :data-cy="`checkbox-${nonFuncReq.id}`"
                ></v-checkbox>
              </v-container>
              <v-container>
                <v-text-field
                  v-model="newReq"
                  single-line
                  outlined
                  data-cy="reqTextField"
                  label="Add new requirement and press enter"
                  prepend-inner-icon="mdi-plus"
                  @keydown.enter="createNewRequirement()"
                ></v-text-field>
              </v-container>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="cancelDialog()">
                  Close
                </v-btn>
                <v-btn color="blue darken-1" text @click="createNewSystem()">
                  Create
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
      </div>
    </div>
    <div class="quadro">
      <v-text-field label="Solo" solo outlined></v-text-field>
      <v-divider class="divisor"></v-divider>
      <strong>My sistems</strong>
      <div class="sistemas">
        <div v-for="system of systems" :key="system.id" class="sistema">
          <nuxt-link :to="`/modules/${system.id}`">
            <div class="imagem"></div>
          </nuxt-link>
          <div class="nomeSistema">{{ system.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],

  async fetch() {
    this.systems = await fetch('http://localhost:8000/sistema').then((res) =>
      res.json()
    )
    this.nonFuncReqs = await fetch(
      'http://localhost:8000/non-func-reqs'
    ).then((res) => res.json())

    console.log('Sujeira: ', this.$v.$anyDirty)
    console.log('Erro:  ', this.$v.$anyError)
  },

  validations: {
    name: { required },
    description: { required },
    checkbox: {
      checked(val) {
        return val
      },
    },
  },

  data() {
    return {
      newReq: '',
      systems: [],
      nonFuncReqs: [],
      name: '',
      description: '',
      dialog: false,
      selected: [],
    }
  },

  computed: {
    nameErrors() {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.required && errors.push('Name is required.')
      return errors
    },

    descriptionErrors() {
      const errors = []
      if (!this.$v.description.$dirty) return errors
      !this.$v.description.required && errors.push('Description is required.')
      return errors
    },
  },

  methods: {
    async createNewSystem() {
      console.log('Sujeira: ', this.$v.$anyDirty)
      console.log('Erro:  ', this.$v.$anyError)
      console.log(this.$v.$anyError)
      console.log('\n')
      if (!this.$v.$anyError) {
        const response = await axios.post('http://localhost:8000/sistema', {
          name: this.name,
          description: this.description,
          reqIds: this.selected,
        })

        this.systems.push(response.data)
        this.name = ''
        this.description = ''
        this.selected = []
        this.dialog = false
      }
    },

    async createNewRequirement() {
      const response = await axios.post('http://localhost:8000/non-func-reqs', {
        req: this.newReq,
      })
      this.nonFuncReqs.push(response.data)
      this.selected.push(response.data.id)
      this.newReq = ''
    },

    cancelDialog() {
      this.name = ''
      this.description = ''
      this.selected = []
      this.newReq = ''
      this.dialog = false
    },
  },
}
</script>

<style scoped>
.tela {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 770px;
  padding-top: 20px;
  padding-right: 20px;
}

.logo {
  width: 100%;
  height: 20%;
}

.divisor {
  width: 100%;
  height: 5%;
  background-color: black;
  margin-bottom: 20px;
  margin-top: 15px;
}

.requisitos {
  display: flex;
  flex-wrap: wrap;
}

.imagem {
  width: 100%;
  height: 85%;
  background-position: center;
  background-image: url('https://icons.iconarchive.com/icons/graphicloads/flat-finance/128/system-settings-icon.png');
}

.systemIcon {
  height: 100%;
  width: 100%;
}

.sistemas {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 81%;
}

.nomeSistema {
  border-radius: 5px;
  border: 1px solid black;
  width: 100%;
  height: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sistema {
  flex-direction: column;
  width: 15%;
  height: 30%;
  margin: 10px;
}

.botão {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 20%;
}

.barraLateral {
  width: 15%;
  height: 100%;
}

.quadro {
  width: 85%;
  height: 100%;
  padding: 30px;
}
</style>
