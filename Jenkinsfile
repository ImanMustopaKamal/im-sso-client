pipeline {
  agent any
  environment {
    APP_ENV = "stag"
    BRANCH = "stag"
    APP_PORT = "8001:8001"
		REPLICA = "2"
    TARGET_DEPLOY = "stag"
    DOCKER_IMAGE = "riskobs-apps-fe:latest"
    DOCKER_IMAGE_REPO = "riskobs-apps-fe"
    DOCKER_REGION = "ap-southeast-1"
    DOCKER_BUILD_URL = "549879428689.dkr.ecr.ap-southeast-1.amazonaws.com"
    DOCKER_BUILD_USERNAME = "AWS"
    SSO_API = "https://authdev.riskobs.com/v1"
    SSO_DOMAIN = ".riskobs.com"
    SSO_APP_CLIENT_ID = "1"
    COPYRIGHT_COMPANY = "PT Manos Solusi"
    DOMAIN_ORIGIN = "https://appsdev.riskobs.com"
    POOL_REGION = "ap-southeast-1"
    ACCESS_KEY = "serverless_secret"
    SECRET_KEY = "serverless_real_secret"
    COGNITO_USER_POOL_ID = "ap-southeast-1_lEfVdgIYi"
    COGNITO_CLIENT_ID = "59l5h186ndrclvo43eiqf6mc3d"
  }
  stages {
    stage('Preparation') {
      steps {
        echo 'Render docker compose file'
        sh "j2 deployment/docker-service/docker-compose.template.yaml - -o deployment/docker-service/docker-compose.yaml"

        echo 'Render nuxt config file'
        withCredentials([string(credentialsId: "${env.ACCESS_KEY}", variable: "SERVERLESS_ACCESS_KEY")]){
          withCredentials([string(credentialsId: "${env.SECRET_KEY}", variable: "SERVERLESS_SECRET_KEY")]){
            sh "j2 deployment/nuxt.config.template.js - -o nuxt.config.js"
          }
        }
      }
    }
    stage('Build Docker Image'){
      steps {
				sh "aws ecr get-login-password --region $DOCKER_REGION | docker login --username $DOCKER_BUILD_USERNAME --password-stdin $DOCKER_BUILD_URL"
        sh "aws ecr describe-repositories --region $DOCKER_REGION --repository-names $DOCKER_IMAGE_REPO || aws ecr create-repository --repository-name $DOCKER_IMAGE_REPO --region $DOCKER_REGION"
        sh "docker build -t $DOCKER_IMAGE ."
        sh "docker tag $DOCKER_IMAGE $DOCKER_BUILD_URL/$DOCKER_IMAGE"
        sh "docker push $DOCKER_BUILD_URL/$DOCKER_IMAGE"
      }
    }
  }
  post {
    failure {
      slackSend (color: "#FF0000", message: "Failed: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'\n (Build URL: ${env.BUILD_URL})")
    }
  }
}