<script setup>
import FooterDividerComponent from './FooterDividerComponent.vue';
import TopFooterComponent from './TopFooterComponent.vue';
import BottomFooterComponent from './BottomFooterComponent.vue';
</script>

<template>
    <div>
        <FooterDividerComponent></FooterDividerComponent>
        <div class="w-[1350px] max-w-full mx-auto mt-10">
            <TopFooterComponent></TopFooterComponent>
        </div>
        <BottomFooterComponent></BottomFooterComponent>
    </div>
</template>