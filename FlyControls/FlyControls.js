import {
	EventDispatcher,
	Quaternion,
	Vector3
} from 'three';

const _changeEvent = { type: 'change' };

class FlyControls extends EventDispatcher {

	constructor( object, domElement,sun ) {

		super();

		this.object = object;
		this.domElement = domElement;


		this.sun = sun;
		this.merkurius;
		this.venus;
		this.earth;
		this.moon;
		this.mars;
		this.jupiter;
		this.saturn;
		this.uranus;
		this.cruiser;
		this.ufo;
		// API

		this.movementSpeed = 1.0;
		this.rollSpeed = 0.005;

		this.dragToLook = false;
		this.autoForward = false;

		// disable default target object behavior

		// internals

		const scope = this;

		const EPS = 0.000001;

		const lastQuaternion = new Quaternion();
		const lastPosition = new Vector3();

		this.tmpQuaternion = new Quaternion();

		this.status = 0;

		this.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0 };
		this.moveVector = new Vector3( 0, 0, 0 );
		this.rotationVector = new Vector3( 0, 0, 0 );

		this.keydown = function ( event ) {

			if ( event.altKey ) {

				return;

			}

			switch ( event.code ) {

				case 'ShiftLeft':
				case 'ShiftRight': this.movementSpeedMultiplier = .1; break;

				case 'KeyW': this.moveState.forward = 1; break;
				case 'KeyS': this.moveState.back = 1; break;

				case 'KeyA': this.moveState.left = 1; break;
				case 'KeyD': this.moveState.right = 1; break;

				case 'KeyR': this.moveState.up = 1; break;
				case 'KeyF': this.moveState.down = 1; break;

				case 'ArrowUp': this.moveState.pitchUp = 1; break;
				case 'ArrowDown': this.moveState.pitchDown = 1; break;

				case 'ArrowLeft': this.moveState.yawLeft = 1; break;
				case 'ArrowRight': this.moveState.yawRight = 1; break;

				case 'KeyQ': this.moveState.rollLeft = 1; break;
				case 'KeyE': this.moveState.rollRight = 1; break;

			}

			this.updateMovementVector();
			this.updateRotationVector();

		};

		this.keyup = function ( event ) {

			switch ( event.code ) {

				case 'ShiftLeft':
				case 'ShiftRight': this.movementSpeedMultiplier = 1; break;

				case 'KeyW': this.moveState.forward = 0; break;
				case 'KeyS': this.moveState.back = 0; break;

				case 'KeyA': this.moveState.left = 0; break;
				case 'KeyD': this.moveState.right = 0; break;

				case 'KeyR': this.moveState.up = 0; break;
				case 'KeyF': this.moveState.down = 0; break;

				case 'ArrowUp': this.moveState.pitchUp = 0; break;
				case 'ArrowDown': this.moveState.pitchDown = 0; break;

				case 'ArrowLeft': this.moveState.yawLeft = 0; break;
				case 'ArrowRight': this.moveState.yawRight = 0; break;

				case 'KeyQ': this.moveState.rollLeft = 0; break;
				case 'KeyE': this.moveState.rollRight = 0; break;

			}

			this.updateMovementVector();
			this.updateRotationVector();

		};

		this.pointerdown = function ( event ) {

			// if ( this.dragToLook ) {

			// 	this.status ++;

			// } else {

			// 	switch ( event.button ) {

			// 		case 0: this.moveState.forward = 1; break;
			// 		case 2: this.moveState.back = 1; break;

			// 	}

			// 	this.updateMovementVector();

			// }

		};

		this.pointermove = function ( event ) {

			// if ( ! this.dragToLook || this.status > 0 ) {

			// 	const container = this.getContainerDimensions();
			// 	const halfWidth = container.size[ 0 ] / 2;
			// 	const halfHeight = container.size[ 1 ] / 2;

			// 	this.moveState.yawLeft = - ( ( event.pageX - container.offset[ 0 ] ) - halfWidth ) / halfWidth;
			// 	this.moveState.pitchDown = ( ( event.pageY - container.offset[ 1 ] ) - halfHeight ) / halfHeight;

			// 	this.updateRotationVector();

			// }

		};

		this.pointerup = function ( event ) {

			// if ( this.dragToLook ) {

			// 	this.status --;

			// 	this.moveState.yawLeft = this.moveState.pitchDown = 0;

			// } else {

			// 	switch ( event.button ) {

			// 		case 0: this.moveState.forward = 0; break;
			// 		case 2: this.moveState.back = 0; break;

			// 	}

			// 	this.updateMovementVector();

			// }

			// this.updateRotationVector();

		};

		this.update = function (delta,merkurius,venus,earth,moon,mars,jupiter,saturn,uranus,cruiser,ufo) {
			this.merkurius = merkurius;
			this.venus = venus;
			this.earth = earth;
			this.moon = moon;
			this.mars = mars;
			this.jupiter = jupiter;
			this.saturn = saturn;
			this.cruiser = cruiser;
			this.ufo = ufo;
			this.uranus = uranus;
			const moveMult = delta * scope.movementSpeed;
			const rotMult = delta * scope.rollSpeed;

			scope.object.translateX( scope.moveVector.x * moveMult );
			// scope.object.translateY( scope.moveVector.y * moveMult );
			scope.object.translateZ( scope.moveVector.z * moveMult );

			scope.tmpQuaternion.set( scope.rotationVector.x * rotMult, scope.rotationVector.y * rotMult, scope.rotationVector.z * rotMult, 1 ).normalize();
			scope.object.quaternion.multiply( scope.tmpQuaternion );

			if (
				lastPosition.distanceToSquared( scope.object.position ) > EPS ||
				8 * ( 1 - lastQuaternion.dot( scope.object.quaternion ) ) > EPS
			) {

				scope.dispatchEvent( _changeEvent );
				lastQuaternion.copy( scope.object.quaternion );
				lastPosition.copy( scope.object.position );

			}

		};

		this.updateMovementVector = function () {
			const moveMult = 0.003 * scope.movementSpeed;
			let forward = ( this.moveState.forward || ( this.autoForward && ! this.moveState.back ) ) ? 1 : 0;
			let moveVector1 = ( - this.moveState.left + this.moveState.right );
			let moveVector2 = ( - forward + this.moveState.back );
			// console.log(this.merkurius)
			let manual = false;
			// console.log(JSON.stringify(sun.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position))+this.moveState.forward)
			if(this.moveState.back==1){
				if(this.sun.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.z = -7;
					manual=true;
				}
				if(this.merkurius.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.z = -7;
					manual=true;
				}
				if(this.venus.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.z = -7;
					manual=true;
				}
				if(this.earth.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.z = -7;
					manual=true;
				}
				if(this.moon.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.z = -7;
					manual=true;
				}
				if(this.mars.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.z = -7;
					manual=true;
				}
				if(this.jupiter.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.z = -7;
					manual=true;
				}
				if(this.saturn.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.z = -7;
					manual=true;
				}
				if(this.uranus.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.z = -7;
					manual=true;
				}
				if(this.cruiser.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.z = -7;
					manual=true;
				}
				if(this.ufo.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.z = -7;
					manual=true;
				}
				if(!manual)this.moveVector.z = ( - forward + this.moveState.back);
			}else if(forward==1){
				if(this.sun.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.z = 7;
					manual=true;
				}
				if(this.merkurius.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.z = 7;
					manual=true;
				}
				if(this.venus.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.z = 7;
					manual=true;
				}
				if(this.earth.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.z = 7;
					manual=true;
				}
				if(this.moon.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.z = 7;
					manual=true;
				}
				if(this.mars.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.z = 7;
					manual=true;
				}
				if(this.jupiter.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.z = 7;
					manual=true;
				}
				if(this.saturn.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.z = 7;
					manual=true;
				}
				if(this.uranus.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.z = 7;
					manual=true;
				}
				if(this.cruiser.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.z = 7;
					manual=true;
				}
				if(this.ufo.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.z = 7;
					manual=true;
				}
				if(!manual)this.moveVector.z = ( - forward + this.moveState.back);
			}else if(this.moveState.left==1){
				if(this.sun.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.x = 7;
					manual=true;
				}
				if(this.merkurius.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.x = 7;
					manual=true;
				}
				if(this.venus.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.x = 7;
					manual=true;
				}
				if(this.earth.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.x = 7;
					manual=true;
				}
				if(this.moon.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.x = 7;
					manual=true;
				}
				if(this.mars.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.x = 7;
					manual=true;
				}
				if(this.jupiter.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.x = 7;
					manual=true;
				}
				if(this.saturn.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.x = 7;
					manual=true;
				}
				if(this.uranus.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.x = 7;
					manual=true;
				}
				if(this.cruiser.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.x = 7;
					manual=true;
				}
				if(this.ufo.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.x = 7;
					manual=true;
				}
				if(!manual)this.moveVector.x = ( - this.moveState.left + this.moveState.right );
			}else if(this.moveState.right==1){
				if(this.sun.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.x = -7;
					manual=true;
				}
				if(this.merkurius.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.x = -7;
					manual=true;
				}
				if(this.venus.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.x = -7;
					manual=true;
				}
				if(this.earth.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.x = -7;
					manual=true;
				}
				if(this.moon.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.x = -7;
					manual=true;
				}
				if(this.mars.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.x = -7;
					manual=true;
				}
				if(this.jupiter.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.x = -7;
					manual=true;
				}
				if(this.saturn.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.x = -7;
					manual=true;
				}
				if(this.uranus.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.x = -7;
					manual=true;
				}
				if(this.cruiser.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.x = -7;
					manual=true;
				}
				if(this.ufo.containsPoint(scope.object.translateZ(moveVector2 * moveMult ).position)){
					this.moveVector.x = -7;
					manual=true;
				}
				if(!manual)this.moveVector.x = ( - this.moveState.left + this.moveState.right );
			}else{
				this.moveVector.x = 0;
				this.moveVector.z = 0;
			}
			
			// this.moveVector.x = ( - this.moveState.left + this.moveState.right );
			// this.moveVector.y = ( - this.moveState.down + this.moveState.up );
			// console.log( 'move:', [ this.moveVector.x, this.moveVector.z ] );

		};

		this.updateRotationVector = function () {

			this.rotationVector.x = ( - this.moveState.pitchDown + this.moveState.pitchUp );
			this.rotationVector.y = ( - this.moveState.yawRight + this.moveState.yawLeft );
			this.rotationVector.z = ( - this.moveState.rollRight + this.moveState.rollLeft );

			//console.log( 'rotate:', [ this.rotationVector.x, this.rotationVector.y, this.rotationVector.z ] );

		};

		this.getContainerDimensions = function () {

			if ( this.domElement != document ) {

				return {
					size: [ this.domElement.offsetWidth, this.domElement.offsetHeight ],
					offset: [ this.domElement.offsetLeft, this.domElement.offsetTop ]
				};

			} else {

				return {
					size: [ window.innerWidth, window.innerHeight ],
					offset: [ 0, 0 ]
				};

			}

		};

		this.dispose = function () {

			this.domElement.removeEventListener( 'contextmenu', contextmenu );
			this.domElement.removeEventListener( 'pointerdown', _pointerdown );
			this.domElement.removeEventListener( 'pointermove', _pointermove );
			this.domElement.removeEventListener( 'pointerup', _pointerup );

			window.removeEventListener( 'keydown', _keydown );
			window.removeEventListener( 'keyup', _keyup );

		};

		const _pointermove = this.pointermove.bind( this );
		const _pointerdown = this.pointerdown.bind( this );
		const _pointerup = this.pointerup.bind( this );
		const _keydown = this.keydown.bind( this );
		const _keyup = this.keyup.bind( this );

		this.domElement.addEventListener( 'contextmenu', contextmenu );
		this.domElement.addEventListener( 'pointerdown', _pointerdown );
		this.domElement.addEventListener( 'pointermove', _pointermove );
		this.domElement.addEventListener( 'pointerup', _pointerup );

		window.addEventListener( 'keydown', _keydown );
		window.addEventListener( 'keyup', _keyup );

		this.updateMovementVector();
		this.updateRotationVector();

	}

}

function contextmenu( event ) {

	event.preventDefault();

}

export { FlyControls };
