const { ClusterManager, HeartbeatManager } = require('discord-hybrid-sharding');
const axios = require('axios'); // For webhook requests
const config = require('./config.json');

const manager = new ClusterManager(`${__dirname}/index.js`, {
    totalShards: 'auto',
    shardsPerClusters: 3,
    totalClusters: 'auto',
    mode: 'process',
    token: config.TOKEN
});

const webhookUrl = config.WEBHOOK_URL; // Webhook URL from your config

// Function to send logs to the Discord Webhook
async function logToWebhook(message) {
    try {
        await axios.post(webhookUrl, { content: message });
    } catch (error) {
        console.error('[Webhook Logger] Failed to send log to Discord:', error);
    }
}

// Event Handlers with Webhook Logs
manager.on('clusterCreate', cluster => {
    const logMessage = `[Cluster Manager] Launched Cluster ${cluster.id}`;
    logToWebhook(logMessage);
});

manager.on('clusterDisconnect', cluster => {
    const logMessage = `[Cluster Manager] Cluster ${cluster.id} disconnected! Attempting to respawn...`;
    logToWebhook(logMessage);
    manager.respawn(cluster.id).catch(err => {
        const errorMessage = `[Cluster Manager] Failed to respawn Cluster ${cluster.id}: ${err}`;
        logToWebhook(errorMessage);
    });
});

manager.spawn({ timeout: -1 });

manager.extend(
    new HeartbeatManager({
        interval: 2000,
        maxMissedHeartbeats: 5,
    })
);

manager.on('clusterReady', cluster => {
    const logMessage = `[Cluster Manager] Cluster ${cluster.id} is ready!`;
    logToWebhook(logMessage);
});

process.on('uncaughtException', error => {
    const errorMessage = `[Cluster Manager] Uncaught exception: ${error.stack || error}`;
    logToWebhook(errorMessage);
});

process.on('unhandledRejection', reason => {
    const errorMessage = `[Cluster Manager] Unhandled promise rejection: ${reason}`;
    logToWebhook(errorMessage);
});