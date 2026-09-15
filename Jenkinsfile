pipeline {
  agent { label 'node-docker' }
  options { disableConcurrentBuilds() }
  environment { RELEASE_TAG = "${env.BUILD_NUMBER}" }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Install') {
      steps { sh 'node --version && npm --version' }
    }
    stage('Test') {
      steps { sh 'npm test' }
    }
    stage('Build') {
      steps {
        sh 'npm run build'
        sh 'docker build -t checkout-demo:${RELEASE_TAG} .'
      }
    }
    stage('Deploy') {
      steps { sh 'docker compose up -d --no-deps --force-recreate app' }
    }
    stage('Smoke test') {
      steps { sh 'curl --fail --retry 10 --retry-all-errors --retry-delay 2 http://localhost:3000/health' }
    }
  }
}
