---
title: "Spring Rest Template Request and Response Logging"
date: 2022-09-08T09:41:57+01:00
tags: ['programming', 'spring-boot']
---

It's sometimes useful to log HTTP requests and responses when working with a Spring [RestTemplate][1].
If you need better control over exactly what's logged you can use a custom interceptor to add logging before and after the remote call.

## Creating an Interceptor

You'll need to create a class that extends [ClientHttpRequestInterceptor][2] and implement the `intercept` method.

```java
public class LoggingClientHttpRequestInterceptor implements ClientHttpRequestInterceptor {
    private static final AtomicInteger idx = new AtomicInteger(-1);

    private final PrintWriter writer;

    public LoggingClientHttpRequestInterceptor(PrintWriter writer) {
        this.writer = writer;
    }

    @Override
    public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException {
        try {
            int idx = nextId();

            writer.printf("rest-template(%d) > %s %s\n", idx, request.getMethod(), request.getURI());
            request.getHeaders()
                    .toSingleValueMap()
                    .forEach((key, value) -> writer.printf("rest-template(%d) > %s: %s\n", idx, key, value));
            writer.printf("rest-template(%d) > %s\n", idx, new String(body, UTF_8));
            writer.println();

            ClientHttpResponse response = execution.execute(request, body);
            ClientHttpResponseWrapper wrapper = new ClientHttpResponseWrapper(response);

            writer.printf("rest-template(%d) < %s\n", idx, wrapper.getStatusCode());
            wrapper.getHeaders()
                    .toSingleValueMap()
                    .forEach((key, value) -> writer.printf("rest-template(%d) < %s: %s\n", idx, key, value));
            writer.printf("rest-template(%d) < %s\n", idx, wrapper.getBodyAsString());

            return wrapper;
        } finally {
            writer.flush();
        }
    }

    private static int nextId() {
        return LoggingClientHttpRequestInterceptor.idx.incrementAndGet();
    }

    public static class ClientHttpResponseWrapper implements ClientHttpResponse {
        private final ClientHttpResponse response;
        private final byte[] body;

        public ClientHttpResponseWrapper(ClientHttpResponse response) throws IOException {
            this.response = response;
            this.body = StreamUtils.copyToByteArray(response.getBody());
        }

        @Override
        public HttpStatus getStatusCode() throws IOException {
            return response.getStatusCode();
        }

        @Override
        public int getRawStatusCode() throws IOException {
            return response.getRawStatusCode();
        }

        @Override
        public String getStatusText() throws IOException {
            return response.getStatusText();
        }

        @Override
        public void close() {
            response.close();
        }

        @Override
        public InputStream getBody() {
            return new ByteArrayInputStream(body);
        }

        public String getBodyAsString() {
            return new String(body, UTF_8);
        }

        @Override
        public HttpHeaders getHeaders() {
            return response.getHeaders();
        }
    }
```

You'll need to register the interceptor with the RestTemplate by adding it to the list of interceptors.

```java
@Configuration
public class RestClientConfig {
    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getInterceptors().add(new LoggingClientHttpRequestInterceptor(new PrintWriter(System.out)));
        return restTemplate;
    }
```

Once registered, Spring will call the intercept method before the request is dispatched, which allows you to log the request and response.

[1]: https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/client/RestTemplate.html
[2]: https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/http/client/ClientHttpRequestInterceptor.html
