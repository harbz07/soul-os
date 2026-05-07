const MemoryAgent = require('./memoryAgent');

/**
 * The Orchestrator Agent acts as the central router for the soulOS constellation.
 * It delegates tasks to specific agents (Memory, Adapter, Python ML layer).
 */
class OrchestratorAgent {
    constructor() {
        // Initialize our collaborative agents
        this.memoryAgent = new MemoryAgent();
    }

    async init() {
        console.log('[Orchestrator] Waking up constellation...');
        await this.memoryAgent.init();
        console.log('[Orchestrator] All agents ready.');
    }

    /**
     * The main entry point for all incoming messages to soulOS.
     * @param {Object} incomingMessage - Standardized JSON payload.
     */
    async handleMessage(incomingMessage) {
        console.log(`[Orchestrator] Received task: ${incomingMessage.taskType}`);

        try {
            // Always save the incoming context to memory first
            await this.memoryAgent.saveMemory({
                source: 'user',
                content: incomingMessage.content,
                taskType: incomingMessage.taskType
            });

            // Route the message based on the task type
            switch (incomingMessage.taskType) {
                case 'RECALL':
                    console.log('[Orchestrator] Routing to Memory Agent...');
                    const pastContext = await this.memoryAgent.getRecentMemories(3);
                    return { status: 'success', data: pastContext };

                case 'PROCESS_DATA':
                    console.log('[Orchestrator] Routing to Python ML Adapter...');
                    // Here you would call your Python Adapter Agent
                    // const result = await pythonAdapter.runProcess(incomingMessage.content);
                    return { status: 'pending', message: 'Python ML layer not yet connected.' };

                default:
                    console.log(`[Orchestrator] Unknown task type: ${incomingMessage.taskType}`);
                    return { status: 'error', message: 'Task type not recognized by Orchestrator.' };
            }
        } catch (error) {
            // Never swallow errors. Log them clearly.
            console.error('[Orchestrator] Critical routing error:', error.message);
            return { status: 'error', error: error.message };
        }
    }
}

module.exports = OrchestratorAgent;