- Microserviços -> Serviços independetemente implantáveis
- Vantagens: 
  - infraestrutura específica por necessidade do serviço
  - Times grandes

- Desafios:
  - complexidade


  ** Glossário
  -> Message broker: 
  -> Distributed tracing: 
  -> idepontencia: evitar que uma acao seja exucata mais de uma vez caso algo falhe e
    precise ser reprocessado
  -> Circuit breaker: proxi que detecta quando um serviço está lento ou offline 
        e avisa o nosso lado com isso antes de tentar se conectar com uma API externa
    -> Backend from front end: BFF (GraphQl/ Federation)

    pattern de SAGA?

    -> Blue green deployment - checar se o health está pronto para subir a versão 2, se estiver ele vai subindo a versão 2
      e quando estiver tudo pronto ele mata a versão 1
      