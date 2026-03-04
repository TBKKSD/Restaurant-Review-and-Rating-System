export async function getHealth() {
  const response = await fetch('http://localhost:5000/api/health')
  return response.json()
}