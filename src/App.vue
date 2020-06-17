<template>
  <div id="app">
    <div id="nav">
      <router-link to="/calendar">Home</router-link>|
      <router-link to="/main/week">week</router-link>|
      <router-link to="/main/day">day</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
@import "../node_modules/bootstrap/scss/functions";
@import "./assets/variables";
@import "../node_modules/bootstrap/scss/mixins";

@import "../node_modules/bootstrap/scss/bootstrap";
</style>
