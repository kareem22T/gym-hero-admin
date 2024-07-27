<template>
  <div class="card m-4">
    <div class="card-header pb-0 d-flex justify-content-between">
      <h6>Workouts List</h6>
      <button class="btn btn-primary" @click="showAddPopUp = true">Add Workout</button>
    </div>
    <div class="hide-content"  v-if="showAddPopUp"  @click="showAddPopUp = false"></div>
    <div class="pop-up card p-4" v-if="showAddPopUp">
      <form @submit.prevent="addWorkout()">
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

        <div class="d-flex gap-2">
          <button class="btn btn-success w-100">Add Workout</button>
          <button class="btn btn-danger w-100"  @click="showAddPopUp = false">Cancel</button>
        </div>

      </form>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Workout
              </th>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
              >
                Exercises
              </th>
              <th class="text-secondary opacity-7"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="workout in workouts" :key="workout.id">
              <td>
                <div class="d-flex px-2 py-1">
                  <div>
                    <img
                      :src="'data:image/png;base64,' + workout.photo"
                      class="avatar avatar-sm me-3"
                      alt="user1"
                    />
                  </div>
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">{{workout.name}}</h6>
                  </div>
                </div>
              </td>
              <td>
                {{ workout.exercises.length }}
              </td>
              <td>
                <router-link :to="`/exercises/${workout.id}`" class="btn btn-success mx-2">Edit Exercises</router-link>
                <button class="btn btn-danger" @click="deleteWorkout(workout.id)">Delete</button>
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


export default {
  data() {
    return {
        workouts: [],
        showAddPopUp: false,
        name: "",
        photo: null
    }
  },
  methods: {
    async getWorkouts() {
        try {
            const response = await instance.get('/workout');

            this.workouts = response.data;
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
    async addWorkout() {
      try {
        const response = await instance.post('/workout', {
          name: this.name,
          photo: this.photo,
        }, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${this.access_token}`
          }
        });

        $toast.success('Workout has added');
        this.getWorkouts()
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
    async deleteWorkout(id) {
      if (confirm("Are you sure you want to delete workout?"))
      try {
        const response = await instance.delete('/workout/' + id, {
          headers: {
            "Authorization": `Bearer ${this.access_token}`
          }
        });

        $toast.success('Workout has deleted');
        this.getWorkouts()
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

    return {
      access_token,
    };
  },
  mounted() {
    this.getWorkouts()
  }
}
</script>

<style scoped>
.pop-up {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 5;
  transform: translate(-50%, -50%);
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