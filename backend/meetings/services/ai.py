import time

def summarize(text: str) -> str:
    """
    Stubbed "AI" summary.
    Simulates latency and returns a simple dummy string based on input size.
    """
    time.sleep(1.0)
    words = len(text.split())
    return f"[AI-STUB] Summary for ~{words} words of notes. Replace with real logic."
