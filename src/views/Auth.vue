<script setup>
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue';
import logo from '@images/logo.svg?raw';
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
const login = ref({
  username: '',
  password: '',
  error:'',
  loading:false
})

const routers=useRouter()
onBeforeMount(() => {
  const token=localStorage.getItem("token");
  if(token){
      routers.push("/dashboard");
  }
})


const isPasswordVisible = ref(false)

function isValidInput(){
  const  isUsername=login.value.username !==null && login.value.username!=='';
  const  isPassword=login.value.password !==null && login.value.password!=='';
  return isUsername && isPassword;
}

function saveToken(apikey){
  localStorage.setItem("token",apikey);
}


async function auth(){
  try {
      if(!isValidInput()){
        login.value.error="Username ou Mot de passe invalide"
        return
      }
      login.value.error="";
      login.value.loading=true;
       const response= await fetch("http://localhost/api/index.php/login", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                    "Accept": "application/json"
                                                },
                                                body: JSON.stringify({
                                                  login:login.value.username,
                                                  password:login.value.password
                                                })
                                             });
        const data = await response.json();
        if(response.ok){
            saveToken(data.success.token);
            routers.push({path:'/dashboard'})
        }else if(response.status==403) {
              login.value.error="username ou mot de passe incorrect";
        }else {
            console.log("system error "+data.error)
        }
  } catch (error) {
       console.log("try catch error "+error)
  }
  finally{
      login.value.loading=false;
  }
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"
    >
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <div
              class="d-flex text-primary"
              v-html="logo"
            />
          </div>
        </template>

        <VCardTitle class="text-2xl font-weight-bold">
          dolibarr client
        </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2">
        <h5 class="text-h5 mb-1">
          Connexion dans  Dolibarr! 👋🏻
        </h5>
        <p class="mb-0">
        </p>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="auth">
          <VRow>
            <!-- username -->
            <VCol cols="12">
              <VTextField
                v-model="login.username"
                autofocus
                label="Username"
                type="text"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="login.password"
                label="Password"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />
              <div class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4">
                    <div v-show="login.error" class="alert alert-danger" role="alert" style="color: red;" >{{ login.error }}</div>
              </div>
              <!-- login button -->
              <VBtn
                block
                type="submit"
              >
              {{ login.loading? 'Connexion...' : 'Se Connecter' }}
            </VBtn>
            </VCol>

            <!-- create account -->

            <VCol
              cols="12"
              class="d-flex align-center"
            >
              <VDivider />
              <span class="mx-4">or</span>
              <VDivider />
            </VCol>

            <!-- auth providers -->
            <VCol
              cols="12"
              class="text-center"
            >
              <AuthProvider />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
