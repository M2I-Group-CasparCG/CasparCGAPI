pipeline {
  agent any
  stages {
    stage('Testing project') {
      parallel {
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
      }
    }
    stage('Launch appli') {
      steps {
        sh 'npm start run'
      }
    }
  }
}