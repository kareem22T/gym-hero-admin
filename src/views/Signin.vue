<template>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div
              class="mx-auto col-12 d-flex flex-column col-12"
            >
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">Sign In</h4>
                  <p class="mb-0">Enter your username and password to sign in</p>
                </div>
                <div class="card-body">
                  <form role="form" @submit.prevent="login">
                    <div class="mb-3">
                      <input
                        id="username"
                        type="username"
                        placeholder="Username"
                        name="username"
                        class="form-control form-control-lg"
                        size="lg"
                        v-model="username"
                      />
                    </div>
                    <div class="mb-3">
                      <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        name="password"
                        class="form-control form-control-lg"
                        size="lg"
                        v-model="password"
                      />
                    </div>
                    <argon-switch id="rememberMe" name="remember-me"
                      >Remember me</argon-switch
                    >

                    <div class="text-center">
                      <argon-button
                        class="mt-4"
                        variant="gradient"
                        color="success"
                        fullWidth
                        size="lg"
                        >Sign in</argon-button
                      >
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import useAuth from '@/composables/useAuth';
import instance from "../api";
import ArgonSwitch from "@/components/ArgonSwitch.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import 'vue-toast-notification/dist/theme-sugar.css';
import { useToast } from 'vue-toast-notification';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

export default {
  components: {
    ArgonSwitch,
    ArgonButton,
  },
  setup() {
    const { access_token, isAuthentication, login, logout } = useAuth();
    const username = ref("");
    const password = ref("");
    const router = useRouter();
    const $toast = useToast();

    const handleLogin = async () => {
      try {
        const response = await instance.post('/auth/authenticate', {
          username: username.value,
          password: password.value,
        });

        $toast.success('Successfully logged in');

        if(response.data.access_token) {
          login({
            access_token: response.data.access_token,
          });
  
          setTimeout(() => {
            router.push('/');
          }, 500);
        } else {
          $toast.error('Failed to log in');
        }

        console.log('Response data:', response.data);
      } catch (error) {
        $toast.error('Failed to log in');

        if (error.response) {
          console.log('Error response data:', error.response.data);
          console.log('Error response status:', error.response.status);
          console.log('Error response headers:', error.response.headers);
        } else {
          console.log('Error message:', error.message);
        }
      }
    };

    return {
      access_token,
      isAuthentication,
      login: handleLogin,
      logout,
      username,
      password,
    };
  },
};
</script>
