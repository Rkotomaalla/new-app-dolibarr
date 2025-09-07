import auth from '@/views/Auth.vue'
import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: auth},
    {
      path: '/',
      component: () => import('../layouts/default.vue'),
      children: [
        {
          path: 'reset',
          component: () => import('../views/ResetData.vue'),
        },
        {
          path: 'importCsv',
          component: () => import('../pages/ImportCsv.vue'),
        },


// page de formulaire


         {
          path: 'new',
          children:[
           {  
              path: 'mos',
               component: () => import('../pages/mos/NewMos.vue'),
            },
            {
              path:'listmos',
              component: () => import('../pages/mos/NewListMos.vue')
            }
          ]
        },



// affiche des Lists


        {
          path: 'list',
          children:[
           {  
              path: 'mos',
              component: () => import('../pages/mos/ListMos.vue')
            },
          ]
        },


        {
          path: 'dashboard',
          component: () => import('../pages/dashboard.vue'),
        },
        {
          path: 'account-settings',
          component: () => import('../pages/account-settings.vue'),
        },
        {
          path: 'typography',
          component: () => import('../pages/typography.vue'),
        },
        {
          path: 'icons',
          component: () => import('../pages/icons.vue'),
        },
        {
          path: 'cards',
          component: () => import('../pages/cards.vue'),
        },
        {
          path: 'tables',
          component: () => import('../pages/tables.vue'),
        },
        {
          path: 'form-layouts',
          component: () => import('../pages/form-layouts.vue'),
        },
      ],
    },
    {
      path: '/',
      component: () => import('../layouts/blank.vue'),
      children: [
        {
          path: 'login',
          component: () => import('../pages/login.vue'),
        },
        {
          path: 'register',
          component: () => import('../pages/register.vue'),
        },
        {
          path: '/:pathMatch(.*)*',
          component: () => import('../pages/[...all].vue'),
        },
      ],
    },
  ],
})

export default router
