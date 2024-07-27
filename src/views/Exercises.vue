<template>
  <div class="card m-4">
    <div class="card-header pb-0 d-flex justify-content-between">
      <h6>{{ workoutName }} Exercises List</h6>
      <button class="btn btn-primary" @click="showAddPopUp = true">Add Exercise</button>
    </div>
    <div class="hide-content"  v-if="showAddPopUp"  @click="showAddPopUp = false"></div>
    <div class="pop-up-wrapper"  v-if="showAddPopUp">
      <div class="pop-up card p-4 mt-3">
        <form @submit.prevent="addExcerise()">
          <div class="mb-3">
            <input
              id="name"
              type="name"
              placeholder="name"
              name="name"
              class="form-control form-control-lg"
              size="lg"
              v-model="name"
            />
          </div>
  
          <div class="mb-3">
            <input
              id="file"
              type="file"
              placeholder="photo"
              name="file"
              class="form-control form-control-lg"
              size="lg"
              @change="handleChangePhoto"
            />
          </div>
  
          <div class="mb-3">
            <div class="d-flex justify-content-between w-100">
              <h4>Sets</h4>
              <button @click="this.sets.push('')" type="button" class="btn btn-success">Add</button>
            </div>
            <div 
            v-for="(set, index) in sets" :key="index"
            class="d-flex justify-content-between gap-2 align-items-center w-100 mb-2">
              <input
                id="sets"
                type="text"
                placeholder="set"
                name="sets"
                class="form-control form-control-lg"
                size="lg"
                v-model="sets[index]"
              />
              <button @click="this.sets.splice(0, index)" v-if="sets && sets.length > 1" type="button" class="btn btn-danger m-0">delete</button>
            </div>
          </div>
  
          <div class="mb-3">
            <div class="d-flex justify-content-between w-100">
              <h4>Description</h4>
              <button @click="this.descriptions.push('')" type="button" class="btn btn-success">Add</button>
            </div>
            <div 
            v-for="(description, index) in descriptions" :key="index"
            class="d-flex justify-content-between gap-2 align-items-center w-100 mb-2">
              <input
                id="description"
                type="text"
                placeholder="description"
                name="description"
                class="form-control form-control-lg"
                size="lg"
                v-model="descriptions[index]"
              />
              <button @click="this.descriptions.splice(0, index)" v-if="descriptions && descriptions.length > 1" type="button" class="btn btn-danger m-0">delete</button>
            </div>
          </div>
  
          <div class="mb-3">
            <div class="d-flex justify-content-between w-100">
              <h4>Instruction</h4>
              <button @click="this.instructions.push('')" type="button" class="btn btn-success">Add</button>
            </div>
            <div 
            v-for="(instruction, index) in instructions" :key="index"
            class="d-flex justify-content-between gap-2 align-items-center w-100 mb-2">
              <input
                id="instruction"
                type="text"
                placeholder="instruction"
                name="instruction"
                class="form-control form-control-lg"
                size="lg"
                v-model="instructions[index]"
              />
              <button @click="this.instructions.splice(0, index)" v-if="instructions && instructions.length > 1" type="button" class="btn btn-danger m-0">delete</button>
            </div>
          </div>
  
          <div class="d-flex gap-2">
            <button class="btn btn-success w-100">Add Workout</button>
            <button class="btn btn-danger w-100"  @click="showAddPopUp = false">Cancel</button>
          </div>
  
        </form>
      </div>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Exercise
              </th>
              <th class="text-secondary opacity-7"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="exercise in exercises" :key="exercise.id">
              <td>
                <div class="d-flex px-2 py-1">
                  <div>
                    <img
                      :src="'data:image/png;base64,' + exercise.photo"
                      class="avatar avatar-sm me-3"
                      alt="user1"
                    />
                  </div>
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">{{exercise.name}}</h6>
                  </div>
                </div>
              </td>
              <td>
                <button class="btn btn-danger" @click="deleteExercise(exercise.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import instance from '../api';
import useAuth from '@/composables/useAuth';
import 'vue-toast-notification/dist/theme-sugar.css';
import { useToast } from 'vue-toast-notification';
const $toast = useToast();
import { useRoute } from 'vue-router';

export default {
  data() {
    return {
        exercises: [],
        workoutName: "",
        sets: [""],
        descriptions: [""],
        instructions: [""],
        showAddPopUp: false,
        name: "",
        photo: null
    }
  },
  methods: {
    async getWorkout() {
        try {
            const response = await instance.get('/workout/' + this.id);

            this.exercises = response.data.exercises;
            this.workoutName = response.data.name;
            console.log('Response data:', response.data);
        } catch (error) {
            if (error.response) {
                console.log('Error response data:', error.response.data);
                console.log('Error response status:', error.response.status);
                console.log('Error response headers:', error.response.headers);
            } else {
                console.log('Error message:', error.message);
            }
        }
    }, 
    handleChangePhoto(e) {
      this.photo = e.target.files[0]
    },
    async addExcerise() {
      try {
        const response = await instance.post('/exercise', {
          name: this.name,
          photo: this.photo,
          sets: this.sets,
          description: this.descriptions,
          instructions: this.instructions,
          workoutId: this.id
        }, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${this.access_token}`
          }
        });

        $toast.success('Workout has added');
        this.getWorkout()
        this.showAddPopUp = false

        console.log('Response data:', response.data);
      } catch (error) {
        $toast.error('Failed to add');
        if (error.response) {
          console.log('Error response data:', error.response.data);
          console.log('Error response status:', error.response.status);
          console.log('Error response headers:', error.response.headers);
        } else {
          console.log('Error message:', error.message);
        }
      }
    },
    async deleteExercise(id) {
      if (confirm("Are you sure you want to delete excercise?"))
      try {
        const response = await instance.delete('/exercise/' + id, {
          headers: {
            "Authorization": `Bearer ${this.access_token}`
          }
        });

        $toast.success('Exercise has deleted');
        this.getWorkout()
        this.showAddPopUp = false

        console.log('Response data:', response.data);
      } catch (error) {
        $toast.error('Failed to delete');
        if (error.response) {
          console.log('Error response data:', error.response.data);
          console.log('Error response status:', error.response.status);
          console.log('Error response headers:', error.response.headers);
        } else {
          console.log('Error message:', error.message);
        }
      }
    }
  },
  setup() {
    const { access_token } = useAuth();
    const route = useRoute();
    const id = route.params.id;
    return {
      access_token,
      id,
    };
  },
  mounted() {
    this.getWorkout()
  }
}
</script>

<style scoped>
.pop-up-wrapper {
  position: fixed;
  top: 0%;
  left: 0%;
  z-index: 5;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: start;
  overflow: auto;
  padding: 18px;
}
.hide-content {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 4;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.578);
}
</style>