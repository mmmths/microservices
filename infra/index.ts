import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as docker from "@pulumi/docker-build";

// para fazer deploy da aplicação, primeiramente. subir a imagem do docker no ECR(Elastic Container Registry)
const OrdersEcrRepository = new awsx.ecr.Repository('orders-ecr', {
     forceDelete: true,
});

const ordersEcrToken = aws.ecr.getAuthorizationTokenOutput({
     registryId: OrdersEcrRepository.repository.registryId,
});

export const ordersDockerImage = new docker.Image("orders-image", {
     tags:[
          pulumi.interpolate`${OrdersEcrRepository.repository.repositoryUrl}:latest`
     ],
     context: {
          location: '../app-orders'
     },
     push: true,
     platforms: [
          "linux/amd64"
     ],
     registries: [{
          address: OrdersEcrRepository.repository.repositoryUrl,
          username: ordersEcrToken.userName,
          password: ordersEcrToken.password,
     }]
})

//Deploy (ECS + Fargete- é um serviço da AWS que passa um docker file e ele sobe a aplicação)
// Se fubir um aplicação no Fargete sem fazer qualquer tipo de configuração, com o mínimo de recursos que é 1/4 de vCPU e 512 de RAM => $17 por mês
// Spot Instaces => reduzir o valor , poupando 50-70% mas se o dono precisar das instancias novamente a AWS derruba as que erstou usando
// Por isso usar o ECS, se cair uma instância, já trem outra 
//  Nunca usar 100% de Spot Instances, sempre deixar uma instância rodando sem Spot Instances,
// e as outras pode escalar usando spot instance

const cluster = new awsx.classic.ecs.Cluster('app-cluster')

const ordersService = new awsx.classic.ecs.FargateService('fargete-orders', {
     cluster,
     desiredCount: 1,
     waitForSteadyState: false,
     taskDefinitionArgs: {
          container: {
               image: ordersDockerImage.ref,
               cpu: 256,
               memory: 512,
          }
     }
})