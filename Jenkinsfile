pipeline {
  agent any
  stages {
    stage('Install appli') {
      steps {
        sh 'npm install'
      }
    }
    stage('Test appli') {
      steps {
        sh 'npm test'
      }
    }
    stage('Launch appli') {
      steps {
        sh 'npm start run'
      }
    }
  }
}