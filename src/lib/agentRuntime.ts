import { executePrompt } from "./gemini";
import { supabase } from "./supabaseClient";

export type AgentNode = {
    id: string;
    type: string;
    data: {
        label: string;
        type: string;
        config?: any;
    };
};

export type AgentEdge = {
    id: string;
    source: string;
    target: string;
};

export type AgentConfig = {
    nodes: AgentNode[];
    edges: AgentEdge[];
};

export async function runAgentWorkflow(config: AgentConfig, userInputs: Record<string, string>, userId: string) {
    const { nodes } = config;
    const results: Record<string, any> = {};

    // Helper to get service keys from Supabase
    const getServiceKey = async (service: string) => {
        const { data } = await supabase
            .from("api_keys")
            .select("key_hash")
            .eq("user_id", userId)
            .eq("service", service)
            .single();
        return data?.key_hash;
    };

    // Simple sequential execution for now (can be expanded to DAG)
    // We'll follow the edges from triggers
    const triggers = nodes.filter(n => n.type === 'trigger');

    for (const trigger of triggers) {
        results[trigger.id] = userInputs[trigger.id] || "Trigger active";
        await processNextNodes(trigger.id, config, results, getServiceKey);
    }

    return results;
}

async function processNextNodes(
    currentNodeId: string,
    config: AgentConfig,
    results: Record<string, any>,
    getServiceKey: (service: string) => Promise<string | undefined>
) {
    const outboundEdges = config.edges.filter(e => e.source === currentNodeId);

    for (const edge of outboundEdges) {
        const node = config.nodes.find(n => n.id === edge.target);
        if (!node) continue;

        try {
            switch (node.type) {
                case 'prompt':
                    const context = JSON.stringify(results);
                    results[node.id] = await executePrompt(node.data.label, { context });
                    break;

                case 'github':
                    const token = await getServiceKey('github');
                    if (!token) throw new Error("GitHub token not found in API Ecosystem");
                    // Placeholder for dynamic repo/owner parsing
                    results[node.id] = "GitHub Action skipped: Repository details missing";
                    break;

                case 'logic':
                    results[node.id] = "Logic Branch: True"; // Placeholder
                    break;

                default:
                    results[node.id] = `Executed ${node.type}`;
            }

            // Recurse
            await processNextNodes(node.id, config, results, getServiceKey);
        } catch (error: any) {
            results[node.id] = `Error: ${error.message}`;
        }
    }
}
