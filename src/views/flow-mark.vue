<template>
    <section class="section">
        <div class="container">
            <div class="row mt-5">

                <div class="col-sm-3 col-md-3 col-md-offset-4 ">
                    <div class="card shadow text-center">
                        <div class="position-relative rounded-top progress-wrapper" style="background-image: linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12);">
                            <div class="wave" style="bottom: 60%;"></div>
                        </div>
                    </div>
                </div>

                <div class="col-sm-3 col-md-3">
                    <div class="card shadow text-center">
                        <div class="position-relative rounded-top progress-wrapper" data-color="#fdb157" style="background-image: linear-gradient(to right top, #1f0537, #380c60, #55108c, #7413bb, #9612eb);">
                            <div class="wave" data-progress="90%" style="bottom: 90%;"></div>
                        </div>

                    </div>
                </div>


                <div class="col-sm-3 col-md-3">
                    <div class="card shadow text-center">
                        <div class="position-relative rounded-top progress-wrapper" data-color="#bdecf6" style="background-color: rgb(189, 236, 246);">
                            <div class="wave" data-progress="80%" style="bottom: 80%;"></div>
                        </div>

                    </div>
                </div>

                <div class="col-sm-3 col-md-3">
                    <div class="card shadow text-center">
                        <div class="position-relative rounded-top progress-wrapper" data-color="#ffbcaa" style="background-color: #734ae8;
background-image: linear-gradient(315deg, #734ae8 0%, #89d4cf 74%);">
                            <div class="wave" data-progress="70%" style="bottom: 70%;"></div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    </section>
</template>

<script>
    export default {
        name: "flow-mark"
    }
</script>

<style scoped lang="less">
    @import "../assets/boostrap-mini.css";
    .container {
        max-width: 960px;
    }

    @media (min-width: 1200px){
        .container, .container-lg, .container-md, .container-sm, .container-xl {
            max-width: 1140px;
        }
    }


    @media (min-width: 992px){
        .container, .container-lg, .container-md, .container-sm {
            max-width: 960px;
        }
    }

    .shadow {
        box-shadow: 0px 18px 39.1px 6.9px rgba(224, 241, 255, 0.34) !important;
    }
    .card {
        border: 0;
    }
    .progress-wrapper {
        height: 240px;
        overflow: hidden;
    }

    .wave {
        position: absolute;
        width: 100%;
        height: 100%;
    }


    .card-body {
        -ms-flex: 1 1 auto;
        flex: 1 1 auto;
        min-height: 1px;
        padding: 1.25rem;
    }

    .card-title {
        margin-bottom: .75rem;
    }

    .list-unstyled {
        padding-left: 0;
        list-style: none;
    }

    .card {
        position: relative;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-direction: column;
        flex-direction: column;
        min-width: 0;
        word-wrap: break-word;
        background-color: #fff;
        background-clip: border-box;
        border: 1px solid rgba(0,0,0,.125);
        border-radius: .25rem;
        margin-bottom: 20px;
    }


    .wave::before, .wave::after {
        content: "";
        position: absolute;
        width: 800px;
        height: 800px;
        bottom: 0;
        left: 50%;
        background-color: rgba(255, 255, 255, .4);
        border-radius: 45%;
        -webkit-transform: translateX(-50%) rotate(0);
        transform: translateX(-50%) rotate(0);
        -webkit-animation: rotate 6s linear infinite;
        /* animation: rotate 6s linear infinite; */
        z-index: 10;
    }

    .wave::after {
        border-radius: 47%;
        background-color: rgba(255, 255, 255, 0.9);
        -webkit-transform: translateX(-50%) rotate(0);
        transform: translateX(-50%) rotate(0);
        -webkit-animation: rotate 10s linear -5s infinite;
        animation: rotate 10s linear -5s infinite;
        z-index: 20;
    }


    @keyframes rotate {
        50% {
            transform: translateX(-50%) rotate(180deg);
        }

        100% {
            transform: translateX(-50%) rotate(360deg);
        }
    }
</style>
