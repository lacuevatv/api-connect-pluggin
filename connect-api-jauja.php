<?php 
/*
Plugin Name: connect Api Jauja
Plugin URI: tresfaros.com
Description: La función es conectarse a la api de jauja para tomar info extra
Version:1.0.0
Author:lacueva.tv
Author URI:http://lacueva.tv
License:GPL
*/
defined('ABSPATH') or die("Bye bye");
define('CONNECT-API-FILES',plugin_dir_path(__FILE__));


//encolamos script y estilos
add_action('wp_enqueue_scripts', 'caj_insertar_js');

function caj_insertar_js(){
    
    wp_register_script('caj_myscript', plugins_url( '/js/script-api-jauja.js' ), array(), '1', true );
    wp_enqueue_script('caj_myscript');
    
    wp_register_style( 'caj_my-styles', plugins_url( '/css/styles-api-jauja.css' ) );
	wp_enqueue_style( 'caj_my-styles' );
}