<div class="plugin__mobile-header">
    {title}
</div>
<section class="plugin__content">
    <div
        class="plugin__title plugin__title--chevron-back"
        on:click={() => bcast.emit('rqstOpen', 'menu')}
    >
        {title}
    </div>

    <!-- File Drop Zone -->
    <div
        class="drop-zone"
        class:drag-over={isDragging}
        on:dragover|preventDefault={() => isDragging = true}
        on:dragleave={() => isDragging = false}
        on:drop|preventDefault={handleDrop}
        on:click={() => fileInput.click()}
    >
        {#if isDragging}
            <span class="drop-zone__text">Drop .fpl file here</span>
        {:else}
            <span class="drop-zone__text">Drop .fpl file here<br/>or click to browse</span>
        {/if}
    </div>
    <input
        bind:this={fileInput}
        type="file"
        accept=".fpl"
        on:change={handleFileSelect}
        style="display: none;"
    />

    <!-- Error Message -->
    {#if errorMessage}
        <div class="error-message">{errorMessage}</div>
    {/if}

    <!-- Flight Plan Info -->
    {#if flightPlan}
        <div class="route-info">
            <div class="route-header">
                <strong>Route:</strong> {flightPlan.departure} → {flightPlan.destination}
            </div>
            <div class="route-stats">
                <span>Distance: {flightPlan.totalDistanceNm} nm</span>
                <span>Waypoints: {flightPlan.routePoints.length}</span>
                {#if flightPlan.cruiseAltitudeFeet}
                    <span>Altitude: {flightPlan.cruiseAltitudeFeet} ft</span>
                {/if}
            </div>
        </div>

        <hr />

        <!-- Waypoint List -->
        <div class="waypoint-list">
            {#each flightPlan.routePoints as rp, index}
                <div class="waypoint-item" class:airport={rp.waypoint.type === 'airport'}>
                    <span class="waypoint-id">{rp.waypoint.identifier}</span>
                    <span class="waypoint-coords">
                        {formatCoord(rp.waypoint.lat, 'lat')} {formatCoord(rp.waypoint.lon, 'lon')}
                    </span>
                </div>
            {/each}
        </div>

        <hr />

        <!-- Action Buttons -->
        <button class="primary-btn" on:click={openInDistance}>
            Open in Distance & Planning
        </button>
        <button class="clear-btn" on:click={clearRoute}>Clear Route</button>
    {/if}
</section>

<script lang="ts">
    import bcast from '@windy/broadcast';
    import { map } from '@windy/map';
    import { onDestroy, onMount } from 'svelte';

    import config from './pluginConfig';
    import { parseFplFile } from './lib/fplParser';
    import { RouteRenderer } from './lib/routeRenderer';
    import type { FlightPlan } from './lib/types';

    const { title } = config;

    let fileInput: HTMLInputElement;
    let isDragging = false;
    let errorMessage = '';
    let flightPlan: FlightPlan | null = null;
    let renderer: RouteRenderer | null = null;

    function formatCoord(value: number, type: 'lat' | 'lon'): string {
        const abs = Math.abs(value);
        const deg = abs.toFixed(2);
        if (type === 'lat') {
            return `${deg}°${value >= 0 ? 'N' : 'S'}`;
        }
        return `${deg}°${value >= 0 ? 'E' : 'W'}`;
    }

    async function handleFile(file: File): Promise<void> {
        errorMessage = '';

        if (!file.name.toLowerCase().endsWith('.fpl')) {
            errorMessage = 'Please select a .fpl file';
            return;
        }

        try {
            const content = await file.text();
            flightPlan = parseFplFile(content);

            if (!renderer) {
                renderer = new RouteRenderer({ map });
            }
            renderer.render(flightPlan);
        } catch (err) {
            errorMessage = err instanceof Error ? err.message : 'Failed to parse file';
            flightPlan = null;
        }
    }

    function handleDrop(event: DragEvent): void {
        isDragging = false;
        const file = event.dataTransfer?.files[0];
        if (file) {
            handleFile(file);
        }
    }

    function handleFileSelect(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (file) {
            handleFile(file);
        }
        input.value = '';
    }

    function clearRoute(): void {
        renderer?.clear();
        flightPlan = null;
        errorMessage = '';
    }

    function generateDistanceUrl(plan: FlightPlan): string {
        const waypoints = plan.routePoints
            .map(rp => `${rp.waypoint.lat.toFixed(4)},${rp.waypoint.lon.toFixed(4)}`)
            .join(';');
        return `https://www.windy.com/distance/${waypoints}`;
    }

    function openInDistance(): void {
        if (!flightPlan) return;
        const url = generateDistanceUrl(flightPlan);
        window.location.href = url;
    }

    export const onopen = (_params: unknown) => {
        // Plugin opened
    };

    onMount(() => {
        renderer = new RouteRenderer({ map });
    });

    onDestroy(() => {
        renderer?.clear();
    });
</script>

<style lang="less">
    .drop-zone {
        border: 2px dashed rgba(255, 255, 255, 0.3);
        border-radius: 8px;
        padding: 24px 16px;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-bottom: 16px;

        &:hover {
            border-color: rgba(255, 255, 255, 0.5);
            background: rgba(255, 255, 255, 0.05);
        }

        &.drag-over {
            border-color: #0066ff;
            background: rgba(0, 102, 255, 0.1);
        }

        &__text {
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
            line-height: 1.5;
        }
    }

    .error-message {
        background: rgba(255, 0, 0, 0.2);
        border: 1px solid rgba(255, 0, 0, 0.4);
        border-radius: 4px;
        padding: 8px 12px;
        margin-bottom: 16px;
        color: #ff6b6b;
        font-size: 13px;
    }

    .route-info {
        margin-bottom: 12px;
    }

    .route-header {
        font-size: 15px;
        margin-bottom: 8px;
    }

    .route-stats {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.7);
    }

    .waypoint-list {
        max-height: 300px;
        overflow-y: auto;
    }

    .waypoint-item {
        display: flex;
        justify-content: space-between;
        padding: 6px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 13px;

        &.airport {
            .waypoint-id {
                color: #00cc00;
            }
        }
    }

    .waypoint-id {
        font-weight: 600;
        min-width: 60px;
    }

    .waypoint-coords {
        color: rgba(255, 255, 255, 0.6);
        font-family: monospace;
        font-size: 12px;
    }

    .primary-btn {
        width: 100%;
        padding: 12px;
        background: #0066ff;
        border: none;
        border-radius: 4px;
        color: white;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: background 0.2s ease;
        margin-bottom: 8px;

        &:hover {
            background: #0052cc;
        }
    }

    .clear-btn {
        width: 100%;
        padding: 10px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        color: white;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.2s ease;

        &:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    }

    hr {
        border: none;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        margin: 12px 0;
    }
</style>
