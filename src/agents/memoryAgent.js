const fs = require('fs').promises;
const path = require('path');

// A simple local JSON file to act as our initial memory storage
const MEMORY_FILE_PATH = path.join(__dirname, '..', '..', 'data', 'memory.json');

/**
 * The Memory Agent handles storing and retrieving context for the constellation.
 */
class MemoryAgent {
    constructor() {
        this.memoryPath = MEMORY_FILE_PATH;
    }

    /**
     * Ensures the memory file exists, creating it with an empty array if not.
     */
    async init() {
        try {
            await fs.access(this.memoryPath);
        } catch (error) {
            // File doesn't exist, create it with empty memory array
            await fs.mkdir(path.dirname(this.memoryPath), { recursive: true });
            await fs.writeFile(this.memoryPath, JSON.stringify([]));
            console.log('[MemoryAgent] Initialized new memory file.');
        }
    }

    /**
     * Saves a new memory payload.
     * @param {Object} payload - The standardized JSON message to remember.
     */
    async saveMemory(payload) {
        try {
            const data = await fs.readFile(this.memoryPath, 'utf8');
            const memories = JSON.parse(data);
            
            // Add timestamp and push to memory array
            payload.timestamp = new Date().toISOString();
            memories.push(payload);

            await fs.writeFile(this.memoryPath, JSON.stringify(memories, null, 2));
            console.log(`[MemoryAgent] Saved memory from agent: ${payload.source}`);
            
            return { success: true, message: "Memory saved successfully." };
        } catch (error) {
            console.error('[MemoryAgent] Failed to save memory:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Retrieves the most recent memories.
     * @param {number} limit - How many recent memories to retrieve.
     */
    async getRecentMemories(limit = 5) {
        try {
            const data = await fs.readFile(this.memoryPath, 'utf8');
            const memories = JSON.parse(data);
            
            // Return the last 'limit' items
            return memories.slice(-limit);
        } catch (error) {
            console.error('[MemoryAgent] Failed to retrieve memories:', error.message);
            return [];
        }
    }
}

module.exports = MemoryAgent;