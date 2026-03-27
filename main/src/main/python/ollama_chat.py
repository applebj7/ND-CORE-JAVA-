import requests

BASE_URL = "http://211.111.12.130:11434"
AUTH = "Bearer naedam:ndgoodcompany135"
DEFAULT_MODEL = "llama3.1:8b-instruct-q4_K_M"
HEADERS = {
    "Authorization": AUTH,
    "Content-Type": "application/json"
}

def chat(model, prompt):
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }
    res = requests.post(f"{BASE_URL}/api/generate", headers=HEADERS, json=payload, timeout=120)
    res.raise_for_status()
    return res.json().get("response", "")

def main():
    print(f"Ollama 서버 연결 중... (모델: {DEFAULT_MODEL})")
    print("종료하려면 'exit' 또는 'quit' 입력\n")

    while True:
        question = input("질문: ").strip()
        if not question:
            continue
        if question.lower() in ("exit", "quit"):
            print("종료합니다.")
            break
        try:
            print("답변 생성 중...")
            answer = chat(DEFAULT_MODEL, question)
            print(f"답변: {answer}\n")
        except Exception as e:
            print(f"오류: {e}\n")

if __name__ == "__main__":
    main()
