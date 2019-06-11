import Vue from "vue";
import Router from "vue-router";
import store from './store.js'


Vue.use(Router);

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: "/dash"
    },
    {
      path: "/login",
      name: "login",
      component: () =>
        import(/* webpackChunkName: "auth" */ "@/views/Login.vue")
    },
    {
      path: "/recuperacion",
      name: "recuperacion",
      component: () =>
        import(/* webpackChunkName: "auth" */ "@/views/Recuperar.vue")
    },
    {
      path: "/dash/",
      meta: { auth: true },
      component: () =>
        import(/* webpackChunkName: "dashboard" */ "@/views/dashboard/Board.vue"),
      children: [
        {
          path: "", redirect: "board"
        },
        {
          path: "universidades",
          name: "universidades",
          component: () =>
            import(/* webpackChunkName: "administrador" */ "@/views/pages/administrador/Universidades.vue")
        },
        {
          path: "carreras",
          name: "carreras",
          component: () =>
            import(/* webpackChunkName: "administrador" */ "@/views/pages/administrador/CarrerasyAsignaturas.vue")
        },
        {
          path: "usuarios",
          name: "usuarios",
          component: () =>
            import(/* webpackChunkName: "administrador" */ "@/views/pages/administrador/Usuarios.vue")
        },

        {
          path: "estudiantes",
          name: "estudiantes",
          component: () =>
            import(/* webpackChunkName: "coordinador" */ "@/views/pages/coordinador/Estudiantes.vue")

        },
        { //editInduccion
          path: "editinduccion",
          name: "editinduccion",
          component: () =>
            import(/* webpackChunkName: "coordinador" */ "@/views/pages/coordinador/EditInduccion.vue")
        },
        {
          path: "induccion",
          name: "induccion",
          component: () =>
            import(/* webpackChunkName: "estudiantes" */ "@/views/pages/estudiante/Induccion.vue")

        },//actainicio
        {
          path: "informacionprofesional",
          name: "informacionprofesional",
          component: () =>
            import(/* webpackChunkName: "estudiantes" */ "@/views/pages/estudiante/InformacionProfesional.vue")

        },
        {
          path: "actainicio",
          name: "actainicio",
          component: () =>
            import(/* webpackChunkName: "estudiantes" */ "@/views/pages/estudiante/Actainicio.vue")

        },
        {
          path: "documentos",
          name: "documentos",
          component: () =>
            import(/* webpackChunkName: "estudiantes" */ "@/views/pages/estudiante/Documentos.vue")

        },
        {
          path: "fichasolucion/:idestudiante?",
          name: "fichasolucion",
          component: () =>
            import(/* webpackChunkName: "estudiantes" */ "@/views/pages/estudiante/FichaSolucion.vue")
        },
        {
          path: "cronograma",
          name: "cronograma",
          component: () =>
            import(/* webpackChunkName: "estudiantes" */ "@/views/pages/estudiante/Cronograma.vue")
        },
        {
          path: "bitacora",
          name: "bitacora",
          component: () =>
            import(/* webpackChunkName: "estudiantes" */ "@/views/pages/estudiante/Bitacora.vue")
        },
        {
          path: "evaluacion",
          name: "evaluacion",
          component: () =>
            import(/* webpackChunkName: "estudiantes" */ "@/views/pages/estudiante/Evaluacion.vue")
        },
        {
          path: "board",
          name: "dashboard",
          component: () =>
            import(/* webpackChunkName: "about" */ "@/views/About.vue")
        },
        {
          path: "about",
          name: "about",
          component: () =>
            import(/* webpackChunkName: "about" */ "@/views/About.vue")
        }
      ]
    },
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.auth)) {
    if (!store.getters.isLoggedIn) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})


export default router;