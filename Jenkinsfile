pipeline {
  agent any
  stages {
    stage('Init appli') {
      steps {
        sh 'npm install'
      }
    }
    stage('Test cover code') {
      steps {
        sh 'npm test'
      }
    }
    stage('Test API') {
      parallel {
        stage('run dev') {
          steps {
            sh 'npm run run_dev'
          }
        }
        stage('newman run') {
          steps {
            sleep 10
            sh 'newman run utilities/API/CasparCG\\ api.postman_collection.json'
            sleep 10
            sh 'pkill node'
          }
        }
      }
    }
  }
}