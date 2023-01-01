EXERCISE

1. Read 10 text files in parallel (explore node js fs module)

2. Read first file content and append with second, append Second file content with third file content, etc

SERVER is running at PORT 8080

1 is implemented in,
    1. Callbacks (http://localhost:8080/ or http://localhost:8080/callback)
    2. Async Parallel (http://localhost:8080/parallel)
    3. Async Series (http://localhost:8080/series)

2 is implemented in, 
    1. Async Waterfall (http://localhost:8080/waterfall)

http://localhost:8080/reset - VISIT, TO REST ALL THE txt files that are modified by async Waterfall. This is to clear the modifications so that we can test the async waterfall again and again.



