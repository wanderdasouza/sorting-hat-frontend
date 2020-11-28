<template>
  <div class="app">
    <div class="barraLateral">
      <div class="logo">
        <v-img src="https://i.ibb.co/vJYVw9C/sorting-hat-logo.png"></v-img>
      </div>
      <div class="botão">
        <v-dialog v-model="dialog" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark v-bind="attrs" x-large v-on="on">
              New Service
            </v-btn>
          </template>
          <v-form>
            <v-card>
              <v-card-title>
                <span class="headline"> New Service</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="name"
                        data-cy="nameTextField"
                        label="Name"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="responsibility"
                        label="Responsiblity"
                        data-cy="responsibilityTextField"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="cancelDialog()">
                  Close
                </v-btn>
                <v-btn color="blue darken-1" text @click="createNewService()">
                  Create
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
      </div>
    </div>
    <div>
      <div class="barraDeBusca">
        <v-text-field label="Solo" solo outlined></v-text-field>
        <v-divider class="divisor"></v-divider>
      </div>
      <div id="graph" class="grafo"></div>
    </div>
  </div>
</template>

<script>
import ForceGraph from 'force-graph'
import axios from 'axios'

export default {
  async fetch() {
    const dashLen = 4
    const gapLen = 1

    this.services = await fetch(
      `http://localhost:8000/modules/${this.$route.params.id}/services`
    ).then((res) => res.json())

    for (const service of this.services) {
      const com = await fetch(
        `http://localhost:8000/modules/${this.$route.params.id}/services/${service.id}/communications`
      ).then((res) => res.json())
      if (com.length > 0) {
        com.forEach((c) => {
          this.links.push({
            source: service.id,
            target: c.service_receiver.id,
            dashed: c.sync,
          })
        })
      }
    }

    const graph = {
      nodes: this.services,
      links: this.links,
    }

    ForceGraph()(document.getElementById('graph'))
      .graphData(graph)
      .nodeId('id')
      .onNodeRightClick((node) => {
        this.$router.push({ path: `/service/${node.id}` })
      })
      .linkDirectionalArrowLength(3)
      .zoom(6)
      .centerAt(50, 40)
      .linkDirectionalArrowRelPos(0.95)
      .linkLineDash((link) => link.dashed && [dashLen, gapLen])
      .nodeAutoColorBy('group')
      .linkCurvature(0.25)
      .nodeCanvasObject((node, ctx, globalScale) => {
        const label = node.name
        const fontSize = 16 / globalScale
        ctx.font = `${fontSize}px Sans-Serif`

        ctx.fillStyle = 'rgba(210, 255, 255, 0.8)'

        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = node.color
        ctx.fillText(label, node.x, node.y)
      })
  },

  data() {
    return {
      name: null,
      responsibility: null,
      links: [],
      services: [],
      dialog: false,
    }
  },

  methods: {
    async createNewModule() {
      // if (!this.$v.$anyError) {
      const response = await axios.post(
        `http://localhost:8000/systems/${this.$route.params.id}/modules`,
        {
          name: this.name,
          responsibility: this.responsibility,
        }
      )

      this.modules.push(response)
      // System.insert({
      //   data: {
      //     id: response.data.id,
      //     name: response.data.name,
      //     description: response.data.description,
      //   },
      // })
      this.name = ''
      this.description = ''
      this.dialog = false
      // }
    },

    cancelDialog() {
      this.name = ''
      this.responsibility = ''
      this.dialog = false
    },
  },
}
</script>

<style>
.app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  padding: 20px;
}
.botão {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 20%;
}

.logo {
  width: 100%;
  height: 20%;
}

.barraDeBusca {
  margin-top: 40px;
}

.divisor {
  width: 100%;
  height: 5%;
  background-color: black;
}

.barraLateral {
  width: 15%;
  height: 100%;
  margin-right: 20px;
}

.grafo {
  width: 85%;
  height: 100%;
}
</style>
