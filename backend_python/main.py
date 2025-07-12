from fastapi import FastAPI
import httpx

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "https://bookish-space-adventure-7vxjr5j96xj62p47g-3000.app.github.dev"}

@app.get("/test-internet")
async def test_internet():
    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.github.com")
        data = response.json()
    return {"github_api_root": data}
