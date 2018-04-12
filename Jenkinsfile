pipeline {
  agent any
  stages {
    stage('Install appli') {
      parallel {
        stage('Install appli') {
          steps {
            sh 'npm install'
          }
        }
        stage('Launch appli') {
          steps {
            sh 'npm start run'
          }
        }
        stage('Test appli') {
          steps {
            sh 'npm test'
          }
        }
      }
    }
  }
}