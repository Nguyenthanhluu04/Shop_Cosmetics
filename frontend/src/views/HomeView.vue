<script setup>
import ControlComponent from "@/components/ControlComponent.vue";
import TitleComponent from "../components/TitleComponent.vue";
import FormComponent from "@/components/FormComponent.vue";
import TableComponent from "@/components/TableComponent.vue";
</script>

<template>
<div class="w-[1000px]">
<title-component></title-component>
<div class=" grid md:grid lg:flex my-5 justify-between md:justify-center lg:justify-between  ">
    <control-component/>
    <form-component class="h-[100px]"/>
</div>
<table-component class="md:flex justify-center"></table-component>
</div>
</template>
