(function(global){

    var _easing = 'cubic-bezier(0.645, 0.045, 0.355, 1)';

    global.CSS_EFFECT = { // 효과
        blockReveal: {
            off: {
                prev: {
                    'transform': 'translate3d(-101%, 0, 0)'
                },
                current: {
                    'visibility': 'hidden'
                },
                next: {
                    'transform': 'translate3d(-101%, 0, 0)'
                }
            },
            on: {
                prev: {
                    'transform': 'translate3d(101%, 0, 0)'
                },
                current: {
                    'visibility': 'visible'
                },
                next: {
                    // 'transition': 'transform 1.2s ' + _easing + ' .2s',
                    'transform': 'translate3d(200%, 0, 0)'
                }
            }
        },
        fadeUp: {
            off: {
                prev: {
                    'opacity': 0,
                    'transform': 'translate3d(0, 0, 0)',
                },
                next: {
                    'opacity': 0,
                    'transform': 'translate3d(0, 100%, 0)'
                }
            },
            on: {
                prev: {
                    'opacity': 0,
                    'transform': 'translate3d(0, -100%, 0)'
                },
                next: {
                    'opacity': 1,
                    'transform': 'translate3d(0, 0, 0)'
                }
            }
        },
        fadeLeft: {
            off: {
                prev: {
                    'opacity': 0,
                    'transform': 'translate3d(0, 0, 0)'
                },
                next: {
                    'opacity': 1,
                    'transform': 'translate3d(100%, 0, 0)'
                }
            },
            on: {
                prev: {
                    'opacity': 0,
                    'transform': 'translate3d(-100%, 0, 0)'
                },
                next: {
                    'opacity': 1,
                    'transform': 'translate3d(0, 0, 0)'
                }
            }
        },
        slideUp: {
            off: {
                prev: {
                    'opacity': 1,
                    'transform': 'translate3d(0, 0, 0)'
                },
                next: {
                    'opacity': 1,
                    'transform': 'translate3d(0, 100%, 0)'
                }
            },
            on: {
                prev: {
                    'opacity': 1,
                    'transform': 'translate3d(0, -100%, 0)'
                },
                next: {
                    'opacity': 1,
                    'transform': 'translate3d(0, 0, 0)'
                }
            }
        },
        slideLeft: {
            off: {
                prev: {
                    'opacity': 1,
                    'transform': 'translate3d(0, 0, 0)'
                },
                next: {
                    'opacity': 1,
                    'transform': 'translate3d(100%, 0, 0)'
                }
            },
            on: {
                prev: {
                    'opacity': 1,
                    'transform': 'translate3d(-100%, 0, 0)'
                },
                next: {
                    'opacity': 1,
                    'transform': 'translate3d(0, 0, 0)'
                }
            }
        },
        title: {
            off: {
                prev: {
                    'opacity': 1,
                    'transform': 'translate3d(0, 0, 0) rotateX(0deg)'
                },
                next: {
                    'opacity': 0,
                    'transform': 'translate3d(-100px, 0, 0) rotateX(0deg)'
                }
            },
            on: {
                prev: {
                    'opacity': 0,
                    'transform': 'translate3d(100px, 0, 0) rotateX(0deg)'
                },
                next: {
                    'opacity': 1,
                    'transform': 'translate3d(0, 0, 0) rotateX(0deg)'
                }
            }
        },
        hover: {
            off: {
                prev: {
                    'opacity': 1,
                    'transform': 'translate3d(0, 0, 0) rotateX(0deg)'
                },
                next: {
                    'opacity': 0,
                    'transform': 'translate3d(-40px, 0, 0) rotateX(0deg)'
                }
            },
            on: {
                prev: {
                    'opacity': 0,
                    'transform': 'translate3d(40px, 0, 0) rotateX(0deg)'
                },
                next: {
                    'opacity': 1,
                    'transform': 'translate3d(0, 0, 0) rotateX(0deg)'
                }
            }
        },
        zoomIn: {
            off: {
                prev: {
                    'opacity': 1,
                    'transform': 'scale3d(1, 1, 1)'
                },
                next: {
                    'opacity': 0,
                    'transform': 'scale3d(0, 0, 0)'
                }
            },
            on: {
                prev: {
                    'opacity': 0,
                    'transform': 'scale3d(0, 0, 0)'
                },
                next: {
                    'opacity': 1,
                    'transform': 'scale3d(1, 1, 1)'
                }
            }
        }
    };

})(window);
