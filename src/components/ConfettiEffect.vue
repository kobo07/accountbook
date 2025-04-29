<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
    active: boolean
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let confettiAnimation: number | null = null
let particles: Particle[] = []

interface Particle {
    x: number
    y: number
    size: number
    color: string
    speed: number
    angle: number
    rotation: number
    rotationSpeed: number
}

const colors = [
    '#8774e1', // 主题色
    '#6a5acd', // 深紫色
    '#ffbe76', // 黄色
    '#ff7979', // 红色
    '#7bed9f', // 绿色
    '#54a0ff', // 蓝色
    '#ff6b81', // 粉色
]

function createConfetti() {
    if (!canvasRef.value) return

    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 设置画布大小为视口大小
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // 创建60个粒子
    particles = []
    for (let i = 0; i < 60; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 3,
            size: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 5 + 2,
            angle: Math.random() * Math.PI * 2, // 0 - 2PI的随机角度
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.2,
        })
    }

    // 开始动画
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // 如果所有粒子都已离开画布，停止动画
        if (particles.length === 0) {
            if (confettiAnimation) {
                cancelAnimationFrame(confettiAnimation)
                confettiAnimation = null
            }
            return
        }

        // 更新并绘制每个粒子
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i]

            // 更新位置
            p.x += Math.cos(p.angle) * p.speed
            p.y += Math.sin(p.angle) * p.speed + 0.5 // 添加重力效果
            p.rotation += p.rotationSpeed

            // 如果粒子离开画布，移除它
            if (p.y > canvas.height || p.x < 0 || p.x > canvas.width) {
                particles.splice(i, 1)
                continue
            }

            // 绘制粒子（矩形带旋转）
            ctx.save()
            ctx.translate(p.x, p.y)
            ctx.rotate(p.rotation)
            ctx.fillStyle = p.color
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2)
            ctx.restore()
        }

        // 继续动画
        confettiAnimation = requestAnimationFrame(animate)
    }

    // 启动动画
    confettiAnimation = requestAnimationFrame(animate)
}

function stopConfetti() {
    if (confettiAnimation) {
        cancelAnimationFrame(confettiAnimation)
        confettiAnimation = null
    }
    particles = []

    // 清除画布
    if (canvasRef.value) {
        const ctx = canvasRef.value.getContext('2d')
        if (ctx) {
            ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
        }
    }
}

// 监听窗口大小变化
function handleResize() {
    if (canvasRef.value) {
        canvasRef.value.width = window.innerWidth
        canvasRef.value.height = window.innerHeight
    }
}

// 当props.active变化时触发效果
function watchActive() {
    if (props.active) {
        createConfetti()
    } else {
        stopConfetti()
    }
}

onMounted(() => {
    window.addEventListener('resize', handleResize)
    watchActive()
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    stopConfetti()
})

// 当props.active变化时，调用watchActive
watch(() => props.active, watchActive)
</script>

<template>
    <canvas ref="canvasRef" class="confetti-canvas"></canvas>
</template>

<style scoped>
.confetti-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1000;
}
</style>
