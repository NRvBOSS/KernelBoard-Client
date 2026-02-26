const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export async function getCPU(){
    const response = await fetch(`${BASE_URL}/cpu`);
    if (!response.ok) {
        throw new Error(`CPU stats error! status: ${response.status}`);
    }
    return response.json();
}

export async function getMemory(){
    const response = await fetch(`${BASE_URL}/memory`);
    if (!response.ok) {
        throw new Error(`Memory stats error! status: ${response.status}`);
    }
    return response.json();
}