(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.JS3DAmmo = {}));
}(this,  (function (exports) { 
/**
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} z 
 */

class BufferGeometryUtils {

	static computeTangents( geometry ) {

		geometry.computeTangents();
		console.warn( 'THREE.BufferGeometryUtils: .computeTangents() has been removed. Use BufferGeometry.computeTangents() instead.' );

	}

	/**
	 * @param  {Array<THREE.BufferGeometry>} geometries
	 * @param  {Boolean} useGroups
	 * @return {THREE.BufferGeometry}
	 */
	static mergeBufferGeometries( geometries, useGroups = false ) {

		const isIndexed = geometries[ 0 ].index !== null;

		const attributesUsed = new Set( Object.keys( geometries[ 0 ].attributes ) );
		const morphAttributesUsed = new Set( Object.keys( geometries[ 0 ].morphAttributes ) );

		const attributes = {};
		const morphAttributes = {};

		const morphTargetsRelative = geometries[ 0 ].morphTargetsRelative;

		const mergedGeometry = new THREE.BufferGeometry();

		let offset = 0;

		for ( let i = 0; i < geometries.length; ++ i ) {

			const geometry = geometries[ i ];
			let attributesCount = 0;

			// ensure that all geometries are indexed, or none

			if ( isIndexed !== ( geometry.index !== null ) ) {

				console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.' );
				return null;

			}

			// gather attributes, exit early if they're different

			for ( const name in geometry.attributes ) {

				if ( ! attributesUsed.has( name ) ) {

					console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. All geometries must have compatible attributes; make sure "' + name + '" attribute exists among all geometries, or in none of them.' );
					return null;

				}

				if ( attributes[ name ] === undefined ) attributes[ name ] = [];

				attributes[ name ].push( geometry.attributes[ name ] );

				attributesCount ++;

			}

			// ensure geometries have the same number of attributes

			if ( attributesCount !== attributesUsed.size ) {

				console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. Make sure all geometries have the same number of attributes.' );
				return null;

			}

			// gather morph attributes, exit early if they're different

			if ( morphTargetsRelative !== geometry.morphTargetsRelative ) {

				console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. .morphTargetsRelative must be consistent throughout all geometries.' );
				return null;

			}

			for ( const name in geometry.morphAttributes ) {

				if ( ! morphAttributesUsed.has( name ) ) {

					console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '.  .morphAttributes must be consistent throughout all geometries.' );
					return null;

				}

				if ( morphAttributes[ name ] === undefined ) morphAttributes[ name ] = [];

				morphAttributes[ name ].push( geometry.morphAttributes[ name ] );

			}

			// gather .userData

			mergedGeometry.userData.mergedUserData = mergedGeometry.userData.mergedUserData || [];
			mergedGeometry.userData.mergedUserData.push( geometry.userData );

			if ( useGroups ) {

				let count;

				if ( isIndexed ) {

					count = geometry.index.count;

				} else if ( geometry.attributes.position !== undefined ) {

					count = geometry.attributes.position.count;

				} else {

					console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. The geometry must have either an index or a position attribute' );
					return null;

				}

				mergedGeometry.addGroup( offset, count, i );

				offset += count;

			}

		}

		// merge indices

		if ( isIndexed ) {

			let indexOffset = 0;
			const mergedIndex = [];

			for ( let i = 0; i < geometries.length; ++ i ) {

				const index = geometries[ i ].index;

				for ( let j = 0; j < index.count; ++ j ) {

					mergedIndex.push( index.getX( j ) + indexOffset );

				}

				indexOffset += geometries[ i ].attributes.position.count;

			}

			mergedGeometry.setIndex( mergedIndex );

		}

		// merge attributes

		for ( const name in attributes ) {

			const mergedAttribute = this.mergeBufferAttributes( attributes[ name ] );

			if ( ! mergedAttribute ) {

				console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed while trying to merge the ' + name + ' attribute.' );
				return null;

			}

			mergedGeometry.setAttribute( name, mergedAttribute );

		}

		// merge morph attributes

		for ( const name in morphAttributes ) {

			const numMorphTargets = morphAttributes[ name ][ 0 ].length;

			if ( numMorphTargets === 0 ) break;

			mergedGeometry.morphAttributes = mergedGeometry.morphAttributes || {};
			mergedGeometry.morphAttributes[ name ] = [];

			for ( let i = 0; i < numMorphTargets; ++ i ) {

				const morphAttributesToMerge = [];

				for ( let j = 0; j < morphAttributes[ name ].length; ++ j ) {

					morphAttributesToMerge.push( morphAttributes[ name ][ j ][ i ] );

				}

				const mergedMorphAttribute = this.mergeBufferAttributes( morphAttributesToMerge );

				if ( ! mergedMorphAttribute ) {

					console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed while trying to merge the ' + name + ' morphAttribute.' );
					return null;

				}

				mergedGeometry.morphAttributes[ name ].push( mergedMorphAttribute );

			}

		}

		return mergedGeometry;

	}

	/**
	 * @param {Array<BufferAttribute>} attributes
	 * @return {THREE.BufferAttribute}
	 */
	static mergeBufferAttributes( attributes ) {

		let TypedArray;
		let itemSize;
		let normalized;
		let arrayLength = 0;

		for ( let i = 0; i < attributes.length; ++ i ) {

			const attribute = attributes[ i ];

			if ( attribute.isInterleavedBufferAttribute ) {

				console.error( 'THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. InterleavedBufferAttributes are not supported.' );
				return null;

			}

			if ( TypedArray === undefined ) TypedArray = attribute.array.constructor;
			if ( TypedArray !== attribute.array.constructor ) {

				console.error( 'THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.' );
				return null;

			}

			if ( itemSize === undefined ) itemSize = attribute.itemSize;
			if ( itemSize !== attribute.itemSize ) {

				console.error( 'THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.' );
				return null;

			}

			if ( normalized === undefined ) normalized = attribute.normalized;
			if ( normalized !== attribute.normalized ) {

				console.error( 'THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.' );
				return null;

			}

			arrayLength += attribute.array.length;

		}

		const array = new TypedArray( arrayLength );
		let offset = 0;

		for ( let i = 0; i < attributes.length; ++ i ) {

			array.set( attributes[ i ].array, offset );

			offset += attributes[ i ].array.length;

		}

		return new THREE.BufferAttribute( array, itemSize, normalized );

	}

	/**
	 * @param {Array<THREE.BufferAttribute>} attributes
	 * @return {Array<THREE.InterleavedBufferAttribute>}
	 */
	static interleaveAttributes( attributes ) {

		// Interleaves the provided attributes into an InterleavedBuffer and returns
		// a set of InterleavedBufferAttributes for each attribute
		let TypedArray;
		let arrayLength = 0;
		let stride = 0;

		// calculate the the length and type of the interleavedBuffer
		for ( let i = 0, l = attributes.length; i < l; ++ i ) {

			const attribute = attributes[ i ];

			if ( TypedArray === undefined ) TypedArray = attribute.array.constructor;
			if ( TypedArray !== attribute.array.constructor ) {

				console.error( 'AttributeBuffers of different types cannot be interleaved' );
				return null;

			}

			arrayLength += attribute.array.length;
			stride += attribute.itemSize;

		}

		// Create the set of buffer attributes
		const interleavedBuffer = new THREE.InterleavedBuffer( new TypedArray( arrayLength ), stride );
		let offset = 0;
		const res = [];
		const getters = [ 'getX', 'getY', 'getZ', 'getW' ];
		const setters = [ 'setX', 'setY', 'setZ', 'setW' ];

		for ( let j = 0, l = attributes.length; j < l; j ++ ) {

			const attribute = attributes[ j ];
			const itemSize = attribute.itemSize;
			const count = attribute.count;
			const iba = new THREE.InterleavedBufferAttribute( interleavedBuffer, itemSize, offset, attribute.normalized );
			res.push( iba );

			offset += itemSize;

			// Move the data for each attribute into the new interleavedBuffer
			// at the appropriate offset
			for ( let c = 0; c < count; c ++ ) {

				for ( let k = 0; k < itemSize; k ++ ) {

					iba[ setters[ k ] ]( c, attribute[ getters[ k ] ]( c ) );

				}

			}

		}

		return res;

	}

	/**
	 * @param {Array<THREE.BufferGeometry>} geometry
	 * @return {number}
	 */
	static estimateBytesUsed( geometry ) {

		// Return the estimated memory used by this geometry in bytes
		// Calculate using itemSize, count, and BYTES_PER_ELEMENT to account
		// for InterleavedBufferAttributes.
		let mem = 0;
		for ( const name in geometry.attributes ) {

			const attr = geometry.getAttribute( name );
			mem += attr.count * attr.itemSize * attr.array.BYTES_PER_ELEMENT;

		}

		const indices = geometry.getIndex();
		mem += indices ? indices.count * indices.itemSize * indices.array.BYTES_PER_ELEMENT : 0;
		return mem;

	}

	/**
	 * @param {THREE.BufferGeometry} geometry
	 * @param {number} tolerance
	 * @return {THREE.BufferGeometry>}
	 */
	static mergeVertices( geometry, tolerance = 1e-4 ) {

		tolerance = Math.max( tolerance, Number.EPSILON );

		// Generate an index buffer if the geometry doesn't have one, or optimize it
		// if it's already available.
		const hashToIndex = {};
		const indices = geometry.getIndex();
		const positions = geometry.getAttribute( 'position' );
		const vertexCount = indices ? indices.count : positions.count;

		// next value for triangle indices
		let nextIndex = 0;

		// attributes and new attribute arrays
		const attributeNames = Object.keys( geometry.attributes );
		const attrArrays = {};
		const morphAttrsArrays = {};
		const newIndices = [];
		const getters = [ 'getX', 'getY', 'getZ', 'getW' ];

		// initialize the arrays
		for ( let i = 0, l = attributeNames.length; i < l; i ++ ) {

			const name = attributeNames[ i ];

			attrArrays[ name ] = [];

			const morphAttr = geometry.morphAttributes[ name ];
			if ( morphAttr ) {

				morphAttrsArrays[ name ] = new Array( morphAttr.length ).fill().map( () => [] );

			}

		}

		// convert the error tolerance to an amount of decimal places to truncate to
		const decimalShift = Math.log10( 1 / tolerance );
		const shiftMultiplier = Math.pow( 10, decimalShift );
		for ( let i = 0; i < vertexCount; i ++ ) {

			const index = indices ? indices.getX( i ) : i;

			// Generate a hash for the vertex attributes at the current index 'i'
			let hash = '';
			for ( let j = 0, l = attributeNames.length; j < l; j ++ ) {

				const name = attributeNames[ j ];
				const attribute = geometry.getAttribute( name );
				const itemSize = attribute.itemSize;

				for ( let k = 0; k < itemSize; k ++ ) {

					// double tilde truncates the decimal value
					hash += `${ ~ ~ ( attribute[ getters[ k ] ]( index ) * shiftMultiplier ) },`;

				}

			}

			// Add another reference to the vertex if it's already
			// used by another index
			if ( hash in hashToIndex ) {

				newIndices.push( hashToIndex[ hash ] );

			} else {

				// copy data to the new index in the attribute arrays
				for ( let j = 0, l = attributeNames.length; j < l; j ++ ) {

					const name = attributeNames[ j ];
					const attribute = geometry.getAttribute( name );
					const morphAttr = geometry.morphAttributes[ name ];
					const itemSize = attribute.itemSize;
					const newarray = attrArrays[ name ];
					const newMorphArrays = morphAttrsArrays[ name ];

					for ( let k = 0; k < itemSize; k ++ ) {

						const getterFunc = getters[ k ];
						newarray.push( attribute[ getterFunc ]( index ) );

						if ( morphAttr ) {

							for ( let m = 0, ml = morphAttr.length; m < ml; m ++ ) {

								newMorphArrays[ m ].push( morphAttr[ m ][ getterFunc ]( index ) );

							}

						}

					}

				}

				hashToIndex[ hash ] = nextIndex;
				newIndices.push( nextIndex );
				nextIndex ++;

			}

		}

		// Generate typed arrays from new attribute arrays and update
		// the attributeBuffers
		const result = geometry.clone();
		for ( let i = 0, l = attributeNames.length; i < l; i ++ ) {

			const name = attributeNames[ i ];
			const oldAttribute = geometry.getAttribute( name );

			const buffer = new oldAttribute.array.constructor( attrArrays[ name ] );
			const attribute = new THREE.BufferAttribute( buffer, oldAttribute.itemSize, oldAttribute.normalized );

			result.setAttribute( name, attribute );

			// Update the attribute arrays
			if ( name in morphAttrsArrays ) {

				for ( let j = 0; j < morphAttrsArrays[ name ].length; j ++ ) {

					const oldMorphAttribute = geometry.morphAttributes[ name ][ j ];

					const buffer = new oldMorphAttribute.array.constructor( morphAttrsArrays[ name ][ j ] );
					const morphAttribute = new THREE.BufferAttribute( buffer, oldMorphAttribute.itemSize, oldMorphAttribute.normalized );
					result.morphAttributes[ name ][ j ] = morphAttribute;

				}

			}

		}

		// indices

		result.setIndex( newIndices );

		return result;

	}

	/**
	 * @param {THREE.BufferGeometry} geometry
	 * @param {number} drawMode
	 * @return {THREE.BufferGeometry>}
	 */
	static toTrianglesDrawMode( geometry, drawMode ) {

		if ( drawMode === THREE.TrianglesDrawMode ) {

			console.warn( 'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles.' );
			return geometry;

		}

		if ( drawMode === THREE.TriangleFanDrawMode || drawMode === THREE.TriangleStripDrawMode ) {

			let index = geometry.getIndex();

			// generate index if not present

			if ( index === null ) {

				const indices = [];

				const position = geometry.getAttribute( 'position' );

				if ( position !== undefined ) {

					for ( let i = 0; i < position.count; i ++ ) {

						indices.push( i );

					}

					geometry.setIndex( indices );
					index = geometry.getIndex();

				} else {

					console.error( 'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.' );
					return geometry;

				}

			}

			//

			const numberOfTriangles = index.count - 2;
			const newIndices = [];

			if ( drawMode === THREE.TriangleFanDrawMode ) {

				// gl.TRIANGLE_FAN

				for ( let i = 1; i <= numberOfTriangles; i ++ ) {

					newIndices.push( index.getX( 0 ) );
					newIndices.push( index.getX( i ) );
					newIndices.push( index.getX( i + 1 ) );

				}

			} else {

				// gl.TRIANGLE_STRIP

				for ( let i = 0; i < numberOfTriangles; i ++ ) {

					if ( i % 2 === 0 ) {

						newIndices.push( index.getX( i ) );
						newIndices.push( index.getX( i + 1 ) );
						newIndices.push( index.getX( i + 2 ) );

					} else {

						newIndices.push( index.getX( i + 2 ) );
						newIndices.push( index.getX( i + 1 ) );
						newIndices.push( index.getX( i ) );

					}

				}

			}

			if ( ( newIndices.length / 3 ) !== numberOfTriangles ) {

				console.error( 'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.' );

			}

			// build final geometry

			const newGeometry = geometry.clone();
			newGeometry.setIndex( newIndices );
			newGeometry.clearGroups();

			return newGeometry;

		} else {

			console.error( 'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:', drawMode );
			return geometry;

		}

	}

	/**
	 * Calculates the morphed attributes of a morphed/skinned BufferGeometry.
	 * Helpful for Raytracing or Decals.
	 * @param {Mesh | Line | Points} object An instance of Mesh, Line or Points.
	 * @return {Object} An Object with original position/normal attributes and morphed ones.
	 */
	static computeMorphedAttributes( object ) {

		if ( object.geometry.isBufferGeometry !== true ) {

			console.error( 'THREE.BufferGeometryUtils: Geometry is not of type BufferGeometry.' );
			return null;

		}

		const _vA = new THREE.Vector3();
		const _vB = new THREE.Vector3();
		const _vC = new THREE.Vector3();

		const _tempA = new THREE.Vector3();
		const _tempB = new THREE.Vector3();
		const _tempC = new THREE.Vector3();

		const _morphA = new THREE.Vector3();
		const _morphB = new THREE.Vector3();
		const _morphC = new THREE.Vector3();

		function _calculateMorphedAttributeData(
			object,
			material,
			attribute,
			morphAttribute,
			morphTargetsRelative,
			a,
			b,
			c,
			modifiedAttributeArray
		) {

			_vA.fromBufferAttribute( attribute, a );
			_vB.fromBufferAttribute( attribute, b );
			_vC.fromBufferAttribute( attribute, c );

			const morphInfluences = object.morphTargetInfluences;

			if ( material.morphTargets && morphAttribute && morphInfluences ) {

				_morphA.set( 0, 0, 0 );
				_morphB.set( 0, 0, 0 );
				_morphC.set( 0, 0, 0 );

				for ( let i = 0, il = morphAttribute.length; i < il; i ++ ) {

					const influence = morphInfluences[ i ];
					const morph = morphAttribute[ i ];

					if ( influence === 0 ) continue;

					_tempA.fromBufferAttribute( morph, a );
					_tempB.fromBufferAttribute( morph, b );
					_tempC.fromBufferAttribute( morph, c );

					if ( morphTargetsRelative ) {

						_morphA.addScaledVector( _tempA, influence );
						_morphB.addScaledVector( _tempB, influence );
						_morphC.addScaledVector( _tempC, influence );

					} else {

						_morphA.addScaledVector( _tempA.sub( _vA ), influence );
						_morphB.addScaledVector( _tempB.sub( _vB ), influence );
						_morphC.addScaledVector( _tempC.sub( _vC ), influence );

					}

				}

				_vA.add( _morphA );
				_vB.add( _morphB );
				_vC.add( _morphC );

			}

			if ( object.isSkinnedMesh ) {

				object.boneTransform( a, _vA );
				object.boneTransform( b, _vB );
				object.boneTransform( c, _vC );

			}

			modifiedAttributeArray[ a * 3 + 0 ] = _vA.x;
			modifiedAttributeArray[ a * 3 + 1 ] = _vA.y;
			modifiedAttributeArray[ a * 3 + 2 ] = _vA.z;
			modifiedAttributeArray[ b * 3 + 0 ] = _vB.x;
			modifiedAttributeArray[ b * 3 + 1 ] = _vB.y;
			modifiedAttributeArray[ b * 3 + 2 ] = _vB.z;
			modifiedAttributeArray[ c * 3 + 0 ] = _vC.x;
			modifiedAttributeArray[ c * 3 + 1 ] = _vC.y;
			modifiedAttributeArray[ c * 3 + 2 ] = _vC.z;

		}

		const geometry = object.geometry;
		const material = object.material;

		let a, b, c;
		const index = geometry.index;
		const positionAttribute = geometry.attributes.position;
		const morphPosition = geometry.morphAttributes.position;
		const morphTargetsRelative = geometry.morphTargetsRelative;
		const normalAttribute = geometry.attributes.normal;
		const morphNormal = geometry.morphAttributes.position;

		const groups = geometry.groups;
		const drawRange = geometry.drawRange;
		let i, j, il, jl;
		let group, groupMaterial;
		let start, end;

		const modifiedPosition = new Float32Array( positionAttribute.count * positionAttribute.itemSize );
		const modifiedNormal = new Float32Array( normalAttribute.count * normalAttribute.itemSize );

		if ( index !== null ) {

			// indexed buffer geometry

			if ( Array.isArray( material ) ) {

				for ( i = 0, il = groups.length; i < il; i ++ ) {

					group = groups[ i ];
					groupMaterial = material[ group.materialIndex ];

					start = Math.max( group.start, drawRange.start );
					end = Math.min( ( group.start + group.count ), ( drawRange.start + drawRange.count ) );

					for ( j = start, jl = end; j < jl; j += 3 ) {

						a = index.getX( j );
						b = index.getX( j + 1 );
						c = index.getX( j + 2 );

						_calculateMorphedAttributeData(
							object,
							groupMaterial,
							positionAttribute,
							morphPosition,
							morphTargetsRelative,
							a, b, c,
							modifiedPosition
						);

						_calculateMorphedAttributeData(
							object,
							groupMaterial,
							normalAttribute,
							morphNormal,
							morphTargetsRelative,
							a, b, c,
							modifiedNormal
						);

					}

				}

			} else {

				start = Math.max( 0, drawRange.start );
				end = Math.min( index.count, ( drawRange.start + drawRange.count ) );

				for ( i = start, il = end; i < il; i += 3 ) {

					a = index.getX( i );
					b = index.getX( i + 1 );
					c = index.getX( i + 2 );

					_calculateMorphedAttributeData(
						object,
						material,
						positionAttribute,
						morphPosition,
						morphTargetsRelative,
						a, b, c,
						modifiedPosition
					);

					_calculateMorphedAttributeData(
						object,
						material,
						normalAttribute,
						morphNormal,
						morphTargetsRelative,
						a, b, c,
						modifiedNormal
					);

				}

			}

		} else if ( positionAttribute !== undefined ) {

			// non-indexed buffer geometry

			if ( Array.isArray( material ) ) {

				for ( i = 0, il = groups.length; i < il; i ++ ) {

					group = groups[ i ];
					groupMaterial = material[ group.materialIndex ];

					start = Math.max( group.start, drawRange.start );
					end = Math.min( ( group.start + group.count ), ( drawRange.start + drawRange.count ) );

					for ( j = start, jl = end; j < jl; j += 3 ) {

						a = j;
						b = j + 1;
						c = j + 2;

						_calculateMorphedAttributeData(
							object,
							groupMaterial,
							positionAttribute,
							morphPosition,
							morphTargetsRelative,
							a, b, c,
							modifiedPosition
						);

						_calculateMorphedAttributeData(
							object,
							groupMaterial,
							normalAttribute,
							morphNormal,
							morphTargetsRelative,
							a, b, c,
							modifiedNormal
						);

					}

				}

			} else {

				start = Math.max( 0, drawRange.start );
				end = Math.min( positionAttribute.count, ( drawRange.start + drawRange.count ) );

				for ( i = start, il = end; i < il; i += 3 ) {

					a = i;
					b = i + 1;
					c = i + 2;

					_calculateMorphedAttributeData(
						object,
						material,
						positionAttribute,
						morphPosition,
						morphTargetsRelative,
						a, b, c,
						modifiedPosition
					);

					_calculateMorphedAttributeData(
						object,
						material,
						normalAttribute,
						morphNormal,
						morphTargetsRelative,
						a, b, c,
						modifiedNormal
					);

				}

			}

		}

		const morphedPositionAttribute = new THREE.Float32BufferAttribute( modifiedPosition, 3 );
		const morphedNormalAttribute = new THREE.Float32BufferAttribute( modifiedNormal, 3 );

		return {

			positionAttribute: positionAttribute,
			normalAttribute: normalAttribute,
			morphedPositionAttribute: morphedPositionAttribute,
			morphedNormalAttribute: morphedNormalAttribute

		};

	}

}
class CapsuleBufferGeometry extends THREE.BufferGeometry{
    /**
     * 
     * @param {Number} radiusTop 
     * @param {Number} radiusBottom 
     * @param {Number} height 
     * @param {Number} radialSegments 
     * @param {Number} heightSegments 
     * @param {Number} capsTopSegments 
     * @param {Number} capsBottomSegments 
     * @param {Number} thetaStart 
     * @param {Number} thetaLength 
     */
    constructor(radiusTop, radiusBottom, height, radialSegments, heightSegments, capsTopSegments, capsBottomSegments, thetaStart, thetaLength){
        super();
        this.type = 'CapsuleBufferGeometry';

		this.parameters = {
			radiusTop: radiusTop,
			radiusBottom: radiusBottom,
			height: height,
			radialSegments: radialSegments,
			heightSegments: heightSegments,
			thetaStart: thetaStart,
			thetaLength: thetaLength
		};

		radiusTop = radiusTop !== undefined ? radiusTop : 1;
		radiusBottom = radiusBottom !== undefined ? radiusBottom : 1;
		height = height !== undefined ? height : 2;

		radialSegments = Math.floor( radialSegments ) || 8;
		heightSegments = Math.floor( heightSegments ) || 1;
	    capsTopSegments = Math.floor( capsTopSegments ) || 2;
	    capsBottomSegments = Math.floor( capsBottomSegments ) || 2;

		thetaStart = thetaStart !== undefined ? thetaStart : 0.0;
		thetaLength = thetaLength !== undefined ? thetaLength : 2.0 * Math.PI;

	    // Alpha is the angle such that Math.PI/2 - alpha is the cone part angle.
	    var alpha = Math.acos((radiusBottom-radiusTop)/height);

		var vertexCount = calculateVertexCount();
		var indexCount = calculateIndexCount();

		// buffers
		var indices = new THREE.BufferAttribute( new ( indexCount > 65535 ? Uint32Array : Uint16Array )( indexCount ), 1 );
		var vertices = new THREE.BufferAttribute( new Float32Array( vertexCount * 3 ), 3 );
		var normals = new THREE.BufferAttribute( new Float32Array( vertexCount * 3 ), 3 );
		var uvs = new THREE.BufferAttribute( new Float32Array( vertexCount * 2 ), 2 );

		// helper variables

		var index = 0,
		    indexOffset = 0,
		    indexArray = [],
		    halfHeight = height / 2;

		// generate geometry

		generateTorso();

		// build geometry

		this.setIndex( indices );
		this.addAttribute( 'position', vertices );
		this.addAttribute( 'normal', normals );
		this.addAttribute( 'uv', uvs );

		// helper functions

	    function calculateVertexCount(){
	        var count = ( radialSegments + 1 ) * ( heightSegments + 1 + capsBottomSegments + capsTopSegments);
	        return count;
	    }

		function calculateIndexCount() {
			var count = radialSegments * (heightSegments + capsBottomSegments + capsTopSegments) * 2 * 3;
			return count;
		}

		function generateTorso() {

			var x, y;
			var normal = new THREE.Vector3();
			var vertex = new THREE.Vector3();

	        var cosAlpha = Math.cos(alpha);
	        var sinAlpha = Math.sin(alpha);

	        var cone_length =
	            new THREE.Vector2(
	                radiusTop*sinAlpha,
	                halfHeight+radiusTop*cosAlpha
	                ).sub(new THREE.Vector2(
	                    radiusBottom*sinAlpha,
	                    -halfHeight+radiusBottom*cosAlpha
	                )
	            ).length();

	        // Total length for v texture coord
	        var vl = radiusTop*alpha
	                 + cone_length
	                 + radiusBottom*(Math.PI/2-alpha);

			// generate vertices, normals and uvs

	        var v = 0;
	        for( y = 0; y <= capsTopSegments; y++ ) {

	            var indexRow = [];

	            var a = Math.PI/2 - alpha*(y / capsTopSegments);

	            v += radiusTop*alpha/capsTopSegments;

	            var cosA = Math.cos(a);
	            var sinA = Math.sin(a);

	            // calculate the radius of the current row
				var radius = cosA*radiusTop;

	            for ( x = 0; x <= radialSegments; x ++ ) {

					var u = x / radialSegments;

					var theta = u * thetaLength + thetaStart;

					var sinTheta = Math.sin( theta );
					var cosTheta = Math.cos( theta );

					// vertex
					vertex.x = radius * sinTheta;
					vertex.y = halfHeight + sinA*radiusTop;
					vertex.z = radius * cosTheta;
					vertices.setXYZ( index, vertex.x, vertex.y, vertex.z );

					// normal
					normal.set( cosA*sinTheta, sinA, cosA*cosTheta );
					normals.setXYZ( index, normal.x, normal.y, normal.z );

					// uv
					uvs.setXY( index, u, 1 - v/vl );

					// save index of vertex in respective row
					indexRow.push( index );

					// increase index
					index ++;

				}

	            // now save vertices of the row in our index array
				indexArray.push( indexRow );

	        }

	        var cone_height = height + cosAlpha*radiusTop - cosAlpha*radiusBottom;
	        var slope = sinAlpha * ( radiusBottom - radiusTop ) / cone_height;
			for ( y = 1; y <= heightSegments; y++ ) {

				var indexRow = [];

				v += cone_length/heightSegments;

				// calculate the radius of the current row
				var radius = sinAlpha * ( y * ( radiusBottom - radiusTop ) / heightSegments + radiusTop);

				for ( x = 0; x <= radialSegments; x ++ ) {

					var u = x / radialSegments;

					var theta = u * thetaLength + thetaStart;

					var sinTheta = Math.sin( theta );
					var cosTheta = Math.cos( theta );

					// vertex
					vertex.x = radius * sinTheta;
					vertex.y = halfHeight + cosAlpha*radiusTop - y * cone_height / heightSegments;
					vertex.z = radius * cosTheta;
					vertices.setXYZ( index, vertex.x, vertex.y, vertex.z );

					// normal
					normal.set( sinTheta, slope, cosTheta ).normalize();
					normals.setXYZ( index, normal.x, normal.y, normal.z );

					// uv
					uvs.setXY( index, u, 1 - v/vl );

					// save index of vertex in respective row
					indexRow.push( index );

					// increase index
					index ++;

				}

				// now save vertices of the row in our index array
				indexArray.push( indexRow );

			}

	        for( y = 1; y <= capsBottomSegments; y++ ) {

	            var indexRow = [];

	            var a = (Math.PI/2 - alpha) - (Math.PI - alpha)*( y / capsBottomSegments);

	            v += radiusBottom*alpha/capsBottomSegments;

	            var cosA = Math.cos(a);
	            var sinA = Math.sin(a);

	            // calculate the radius of the current row
				var radius = cosA*radiusBottom;

	            for ( x = 0; x <= radialSegments; x ++ ) {

					var u = x / radialSegments;

					var theta = u * thetaLength + thetaStart;

					var sinTheta = Math.sin( theta );
					var cosTheta = Math.cos( theta );

					// vertex
					vertex.x = radius * sinTheta;
					vertex.y = -halfHeight + sinA*radiusBottom;				vertex.z = radius * cosTheta;
					vertices.setXYZ( index, vertex.x, vertex.y, vertex.z );

					// normal
					normal.set( cosA*sinTheta, sinA, cosA*cosTheta );
					normals.setXYZ( index, normal.x, normal.y, normal.z );

					// uv
					uvs.setXY( index, u, 1 - v/vl );

					// save index of vertex in respective row
					indexRow.push( index );

					// increase index
					index ++;

				}

	            // now save vertices of the row in our index array
				indexArray.push( indexRow );

	        }

			// generate indices

			for ( x = 0; x < radialSegments; x ++ ) {

				for ( y = 0; y < capsTopSegments + heightSegments + capsBottomSegments; y ++ ) {

					// we use the index array to access the correct indices
					var i1 = indexArray[ y ][ x ];
					var i2 = indexArray[ y + 1 ][ x ];
					var i3 = indexArray[ y + 1 ][ x + 1 ];
					var i4 = indexArray[ y ][ x + 1 ];

					// face one
					indices.setX( indexOffset, i1 ); indexOffset ++;
					indices.setX( indexOffset, i2 ); indexOffset ++;
					indices.setX( indexOffset, i4 ); indexOffset ++;

					// face two
					indices.setX( indexOffset, i2 ); indexOffset ++;
					indices.setX( indexOffset, i3 ); indexOffset ++;
					indices.setX( indexOffset, i4 ); indexOffset ++;

				}

			}

		}
    }
}
THREE.CapsuleBufferGeometry = CapsuleBufferGeometry;
class Vector3{
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    constructor(x = 0, y = 0, z = 0){
        this.x = x;
        this.y = y;
        this.z = z;
    }
    /**
     * 
     * @param {Vector3} v 
     */
    copy(v){
        if(typeof v.x == 'function'){
            this.x = v.x();
            this.y = v.y();
            this.z = v.z();
        }else{
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
        }
        return this;
    }
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    set(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    /**
     * 
     * @param {Vector3} a 
     * @param {Vector3} b 
     */
    addVectors(a, b){
        this.x = a.x+b.x;
        this.y = a.y+b.y;
        this.z = a.z+b.z;
        return this;
    }
    /**
     * 
     * @param {Vector3} v 
     */
    add(v){
        this.addVectors(this,v);
        return this;
    }
    /**
     * 
     * @param {Vector3} a 
     * @param {Vector3} b 
     */
    subVectors(a, b){
        this.x = a.x-b.x;
        this.y = a.y-b.y;
        this.z = a.z-b.z;
        return this;
    }
    /**
     * 
     * @param {Vector3} v 
     */
    sub(v){
        this.subVectors(this,v);
        return this;
    }
    /**
     * 
     * @param {Number} scalar 
     */
    multiplyScalar(scalar){
        this.x*=scalar;
        this.y*=scalar;
        this.z*=scalar;
        return this;
    }
    lengthSq(){
        return this.x*this.x+this.y*this.y+this.z*this.z;
    }
    length(){
        return Math.sqrt(this.lengthSq);
    }
    manhattanLength(){
        return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z);
    }
    /**
     * 
     * @param {Vector3} v 
     */
    distanceTo(v){
        return Math.sqrt((this.x-v.x)**2+(this.y-v.y)**2+(this.y-v.z)**2);
    }
    /**
     * 
     * @param {Vector3} v 
     */
    manhattanDistanceTo(v){
        return Math.abs(this.x-v.x)+Math.abs(this.y-v.y)+Math.abs(this.z-v.z);
    }
    normalize(){
        let l = this.lengthSq();
        if(l===0){
            this.set(0,0,0);
        }else{
            this.multiplyScalar(1/Math.sqrt(l));
        }
        return this;
    }
    /**
     * 
     * @param {Number} length 
     */
    setLength(length){
        this.normalize();
        this.multiplyScalar(length);
        return this;
    }
    /**
     * 
     * @param {Vector3} v 
     * @param {Number} s 
     */
    addScaledVector(v, s){
        v.multiplyScalar(s);
        this.add(v);
        return this;
    }
    invert(){
        this.x*=-1;
        this.y*=-1;
        this.z*=-1;
        return this;
    }
    clone(){
        return new this.constructor(this.x, this.y, this.z);
    }
    /**
     * 
     * @param {Vector3} v 
     */
    isEqualTo(v){
        return this.x===v.x&&this.y===v.y&&this.z===v.z;    
    }
    /**
     * 
     * @param {Vector3} v1 
     * @param {Vector3} v2 
     */
    directionTo(v1,v2){
        this.subVectors(v2,v1);
        this.normalize();
        return this;
    }
    toString(){
        return '{x:'+this.x+',y:'+this.y+',z:'+this.z+'}';
    }
    /**
     * 
     * @param {Vector3} v 
     * @param {Number} delta 
     */
    isAlmostEqualTo(v,delta){
        return Math.abs(this.x-v.x)<delta&&Math.abs(this.y-v.y)<delta&&Math.abs(this.z-v.z)<delta;
    }
    /**
     * 
     * @param {Number} scalar 
     */
    setScalar(scalar){
        if(typeof scalar!='number'||scalar==undefined){
            console.error('JS3DAmmo.Vector3: scalar value must be a number');
            return this;
        }
        this.x = this.y = this.z = scalar;
    }
}

/**
 * 
 * @param {Object} parameters 
 */
class GravityFeild{
    constructor(parameters){
        this.position = parameters.position||new Vector3();
        this.far = parameters.far||20;
        Object.defineProperty(this,'bodies',{value:[]});
        Object.defineProperty(this,'direction',{value:new Vector3()})
        Object.defineProperty(this,'AmmoDir',{value:new Ammo.btVector3(0,0,0)});
        this.strength = parameters.strength||parameters.force||3;
        this.debugBody = new THREE.Mesh(new THREE.SphereBufferGeometry(1,16,16),new THREE.MeshBasicMaterial({color:0x0000ff,wireframe:true}));
        this.debugBody.position.copy(this.position);
        this.debugBody.scale.multiplyScalar(this.far);
    }
    /**
     * 
     * @param {Body} body 
     */
    addBody(body){
        if(!body instanceof Body){
            console.error('JS3D.GravityFeild: addBody'+"'"+'s argument should be a JS3D.Body');
            return false;
        }
        this._bodies.push(body);
    }
    update(){
        for(var x in this._bodies){
            let pos = this._bodies[x].mesh.position;
            if(this.position.distanceTo(pos)<=this.far){
                this.direction.subVectors(this.position,pos);
                this.direction.normalize();
                this.direction.multiplyScalar(this.strength*-this.position.distanceTo(pos)+this.strength*this.far);
                this.direction.multiplyScalar(this._bodies[x].mass);
                this.AmmoDir.setValue(this._direction.x,this._direction.y,this._direction.z);
                this.bodies[x].physicsBody.applyCentralForce(this._AmmoDir);
            }
        }
    }
}
class Shape{
    constructor(){
        this.material;
        this.geometry;
        this.physicsBodyShape;
        Object.defineProperty(this,'isShape',{value:true});
    }
}
class RigidBody{
    constructor(){
        this.shape;
        this.mesh;
        this.debugBody;
        this.physicsBody;
    }
}
/**
 * 
 * @param {Object} parameters 
 * @param {Vector3} parameters.gravity
 * @param {HTMLElement} parameters.target
 * @param {Object} parameters.rendererSettings
 */
class World{
    constructor(parameters){
        parameters = parameters||{};
    this.gravity = parameters.gravity||new Vector3(0,-9.8,0);
    Object.defineProperty(this,'target',{value:parameters.target||document.body});
    let backgroundColor = parameters.backgroundColor||0x000000;
    this.veiw = 0;
    this.debug = false;
    let width = 0;
    let height = 0;
    this._tmpTrans = new Ammo.btTransform();
    this.telePortPlane;
    if(this.target==document.body){
      width = window.innerWidth;
      height = window.innerHeight;
    }else{
      width = target.clientWidth;
      height = target.clientHeight;
    }
    this.cameras = [new THREE.PerspectiveCamera(75,width/height,0.1,20000)];
    this.cameras[0].position.set(0,5,10);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(backgroundColor);
    this.cameras[0].lookAt(this.scene.position);
    
    let collisionConfiguration,
    dispatcher,
    overlappingPairCache = new Ammo.btDbvtBroadphase(),
    solver = new Ammo.btSequentialImpulseConstraintSolver();
    collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration();
    dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    this.aWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher,overlappingPairCache,solver,collisionConfiguration);
    this.aWorld.setGravity(new Ammo.btVector3(this.gravity.x,this.gravity.y,this.gravity.z));
    this.renderer = new THREE.WebGLRenderer(parameters.rendererSettings);
    this.renderer.setSize(width,height);
    this.target.appendChild(this.renderer.domElement);
    this.bodies = [];
    this.kBodies = [];
    this.gravityFeilds = [];
    this.characterController = null;
    this.debugGroup = new THREE.Group();
    this.scene.add(this.debugGroup);
    }
    /**
    * @param {Body} body 
    */
    add(body){
        if(body == undefined){
            console.error('JS3D.World: World.add should have an argument');
            return false;
        }
        if(!(body instanceof Body||body instanceof Character||body instanceof InfPlane||body instanceof CompoundBody)){
            console.error("JS3D.World: World.add's argument should be a JS3D.Body");
            return false;
        }
        if(body.physicsBody.isKinematicObject()){
            console.error("JS3D.World: World.add should not have a kinematic body");
            this.addKinematicBody(body);
            return false;
        }
        let physBod = body.physicsBody;
        let mesh = body.mesh;
        this.aWorld.addRigidBody(physBod,body.group,body.mask);
        this.scene.add(mesh);
        this.bodies.push(body);
    }
    
    /**
     * @param {Body} kineBody
     */
    addKinematicBody(kineBody){
        if(kineBody == undefined){
            console.error('JS3D.World: World.addKinematicBody should have an argument');
            return false;
        }
        if(!(kineBody instanceof Body||kineBody instanceof CompoundBody)){
            console.error("JS3D.World: World.AddKinematicBody's argument should be a JS3D.Body");
            return false;
        }
        if(!kineBody.physicsBody.isKinematicObject()){
            console.error('JS3D.World: World.addKinematicBody should have a Kinematic Body');
            this.add(body);
            return false;
        }
        this.kBodies.push(kineBody);
        this.aWorld.addRigidBody(kineBody.physicsBody);
        this.scene.add(kineBody.mesh);
        this.debugGroup.add(kineBody.debugBody);
    }
    /**
     * 
     * @param {Body} body 
     */
    remove(body){
        if(body == undefined){
            console.error('JS3D.World: World.remove should have an argument');
            return false;
        }
        if(!body instanceof RigidBody){
            console.error("JS3D.World: World.remove's argument should be a JS3D.Body");
            return false;
        }
        this.aWorld.removeRigidBody(body.physicsBody);
        this.scene.remove(body.mesh);
        this.debugGroup.remove(body.debugBody);
        this.bodies.splice(this.bodies.indexOf(body),1);
    }
    
    /**
     * @param {Number} yV
     * @param {function} onTeleport
     */
    setTeleportPlane(yV,onTeleport){
        this.telePortPlane = {};
        this.telePortPlane.yValue = yV||-10;
        if(typeof onTeleport!='function'){
            console.error('JS3D.World: World.setTeleportPlane onTeleportPlane callback must be a function');
            this.telePortPlane = undefined;
            return false;
        }
        this.telePortPlane.onTeleport = onTeleport;
    }
    /**
     * @param {Number} dt
     */
    update(dt){
        this.aWorld.stepSimulation(dt||1/60,10);
        for(let x in this.bodies){
            let ammoObj = this.bodies[x].physicsBody;
            let threeObj = this.bodies[x].mesh;
            let ms = ammoObj.getMotionState();
            if(ms){
                ms.getWorldTransform(this._tmpTrans);
                let p = this._tmpTrans.getOrigin();
                let q = this._tmpTrans.getRotation();
                if(this.debug){
                    if(!(this.bodies[x].debugBody.parent===this.debugGroup)){
                        this.debugGroup.add(this.bodies[x].debugBody);
                        this.bodies[x].debugBody.position.set(p.x(),p.y(),p.z());
                        this.bodies[x].debugBody.quaternion.set(q.x(),q.y(),q.z(),q.w());
                    }else{
                        this.bodies[x].debugBody.position.set(p.x(),p.y(),p.z());
                        this.bodies[x].debugBody.quaternion.set(q.x(),q.y(),q.z(),q.w());
                    }
                    if(this.bodies[x].debugBody.material!=undefined){
                        if(!ammoObj.isActive()&&(!ammoObj.isStaticOrKinematicObject())){
                            this.bodies[x].debugBody.material.color = new THREE.Color(0xffff00);
                        }else{
                            this.bodies[x].debugBody.material.color = new THREE.Color(0x00ff00);
                        }
                    }else{
                        if(this.bodies[x] instanceof CompoundBody){
                            for(var y = 0;y < this.bodies[x].debugBody.children.length;y++){
                                if(this.bodies[x].debugBody.children[y].material==undefined){
                                    continue;
                                }
                                if(!ammoObj.isActive()&&(!ammoObj.isStaticOrKinematicObject())){
                                    this.bodies[x].debugBody.children[y].material.color = new THREE.Color(0xffff00);
                                }else{
                                    this.bodies[x].debugBody.children[y].material.color = new THREE.Color(0x00ff00);
                                }
                            }
                        }
                    }
                }
                if(!this.bodies[x].gravityAffected){
                    let m = this.bodies[x].mass;
                    world.bodies[x].physicsBody.applyCentralForce(new Ammo.btVector3(this.gravity.x*-m,this.gravity.y*-m,this.gravity.z*-m));
                }
                if(this.telePortPlane!=undefined){
                    if(p.y()<this.telePortPlane.yValue){
                        this.telePortPlane.onTeleport(this.bodies[x]);
                    }
                }
                    if(isNaN(p.x())||isNaN(p.y())||isNaN(p.z())||isNaN(q.x())||isNaN(q.w())||isNaN(q.y())||isNaN(q.z())){
                        threeObj.position.set(0,0,0);
                        threeObj.quaternion.set(0,0,0,1);
                    }else{
                        threeObj.position.set(p.x(),p.y(),p.z());
                        threeObj.quaternion.set(q.x(),q.y(),q.z(),q.w());
                    }
                }
        }
        if(this.characterController){
            this.characterController.updatePosition();
        }
        for(var a in this.kBodies){
            let ammo = this.kBodies[a].physicsBody;
            let ms = ammo.getMotionState();
            if(ms){
                this._tmpTrans.setIdentity();
                let kP = this.kBodies[a].mesh.position;
                let kR = this.kBodies[a].mesh.quaternion;
                this._tmpTrans.setOrigin(new Ammo.btVector3(kP.x,kP.y,kP.z));
                this._tmpTrans.setRotation(new Ammo.btQuaternion(kR.x,kR.y,kR.z,kR.w));
                ms.setWorldTransform(this._tmpTrans);
                let d = this.kBodies[a].debugBody;
                d.position.copy(kP);
                d.quaternion.copy(kR);
            }
        }
        for(var x in this.gravityFeilds){
            this.gravityFeilds[x].update();
            this.gravityFeilds[x].debugBody.scale.set(this.gravityFeilds[x].far,this.gravityFeilds[x].far,this.gravityFeilds[x].far);
            this.gravityFeilds[x].debugBody.position.copy(this.gravityFeilds[x].position);
        }
        this.debugGroup.visible = this.debug;
        this.renderer.render(this.scene,this.cameras[this.veiw]);
    }
    /**
    * @param {GravityFeild} gravFeild
    */
    addGravityFeild(gravFeild){
        this.gravityFeilds.push(gravFeild);
        this.debugGroup.add(gravFeild.debugBody);
    }
    /**
     * @param {Camera} camera
     */
    addCamera(camera){
        if(camera.isPerspectiveCamera||camera.isOrthographicCamera){
            this.cameras.push(camera);
        }else{
            if(camera.isCamera){
                console.error('JS3D.World: World.addCamera currently only has support for perspective cameras and orthographic cameras');
            }else if(!camera.isCamera){
                console.error('JS3D.World: World.addCamera must have a camera as an argument')
            }else if(camera==undefined){
                console.warn('JS3D.World: World.addCamera had no arguments');
            }
        }
    }
    resizeVeiwingWindow(){
        let width,height;
        if(this.target==document.body){
            width = window.innerWidth;
            height = window.innerHeight;
        }else{
            width = this.target.clientWidth;
            height = this.target.clientHeight;
        }
        for(var x in this.cameras){
            if(this.cameras[x].isPerspectiveCamera){
                this.cameras[x].aspect = width/height;
                this.cameras[x].updateProjectionMatrix();
            }else if(this.cameras[x].isOrthographicCamera){
                let cam = this.cameras[x];
                cam.left = -width/2;
                cam.right = width/2;
                cam.top = height/2;
                cam.bottom = -height/2;
                cam.updateProjectionMatrix();
            }
        }
        this.renderer.setSize(width,height);
    }
}
class Body extends RigidBody{
        /**
     * 
     * @param {Object} parameters 
     * @param {Shape} parameters.shape
     * @param {Number} [parameters.mass]
     * @param {Vector3} [parameters.position]
     * @param {Quaternion} [parameters.rotation]
     * @param {Number} [parameters.collisionGroup] - can also be parameters.group
     * @param {Number} [parameters.collisionMask] - can also be parameters.mask
     * @param {Number} [parameters.friction]
     * @param {Number} [parameters.restitution]
     */
    constructor(parameters){
        super();
        let shape = parameters.shape;
        if(shape==undefined){
            console.error('JS3D.Body: shape must be defined');
            return false;
        }
        if(!shape instanceof Shape){
            console.error('JS3D.Body: shape must be a type of JS3D.Shape');
            return false;
        }
        let position = parameters.position||new Vector3();
        let rotation = parameters.rotation||parameters.quaternion||new THREE.Quaternion(0,0,0,1);
        let friction = parameters.friction||0.5;
        let restitution = parameters.restitution||0;
        let mass = parameters.mass||0;
        let geometry = shape.geometry;
        let material = shape.material;
        this.mass = mass;
        this.gravityAffected = true;
        let physicsShape = shape.physicsBodyShape;
        this.mesh = new THREE.Mesh(geometry,material);
        Object.defineProperty(this,'initPosition',{value:position})
        Object.defineProperty(this,'initRotation',{value:rotation})
        this.debugBody = shape.debugBody||new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0x00ff00,wireframe:true}));
        this.group = parameters.group||parameters.collisionGroup;
        this.mask = parameters.mask||parameters.collisionMask;
        this.mesh.position.copy(position);
        this.mesh.quaternion.copy(rotation);
        this.debugBody.position.copy(position);
        this.debugBody.quaternion.copy(rotation);
        let transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(position.x,position.y,position.z));
        transform.setRotation(new Ammo.btQuaternion(rotation.x,rotation.y,rotation.z,rotation.w));
        let ms = new Ammo.btDefaultMotionState(transform);
        let localInertia = new Ammo.btVector3(0,0,0);
        physicsShape.calculateLocalInertia(mass,localInertia);
        this.shape = shape;
        let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass,ms,physicsShape,localInertia);
        this.physicsBody = new Ammo.btRigidBody(rbInfo);
        this.physicsBody.setFriction(friction);
        this.physicsBody.setRestitution(restitution);
    }
    /**
     * @param {Boolean} cast
     * @param {Boolean} receive
     */
    setShadows(cast,receive){
        this.mesh.castShadow = cast||true;
        this.mesh.receiveShadow = receive||true;
    }
    /**
     * @param {Number} mass
     */
    setMass(mass){
        this.physicsBody.setMassProps(mass,new Ammo.btVector3(0,0,0));
    }
    scale = function(scaleFac){
        this.shape.physicsBodyShape.setLocalScaling(new Ammo.btVector3(scaleFac,scaleFac,scaleFac));
        this.debugBody.scale.copy(scaleVector);
        this.mesh.scale.copy(scaleVector);
    }
    /**
     * @param {Number} scaleFac
     */
}
class InfPlane extends RigidBody{
    /**
     * 
     * @param {Object} parameters 
     * @param {Vector3} parameters.normal
     * @param {Number} parameters.distance
     * @param {THREE.Material} parameters.material
     */
    constructor(parameters){
        parameters = parameters||{};
        let normal = parameters.normal||new Vector3(0,1,0);
        let distance = parameters.distance||1;
        let material = parameters.material||new THREE.MeshBasicMaterial();
        normal.normalize();
        let tN = new THREE.Vector3().copy(normal);
        let iPlaneBodyS = new Ammo.btStaticPlaneShape(new Ammo.btVector3(tN.x,tN.y,tN.z),distance);
        let iPT = new Ammo.btTransform();
        iPT.setIdentity();
        iPT.setOrigin(new Ammo.btVector3(0,0,0));
        iPT.setRotation(new Ammo.btQuaternion(0,0,0,1));
        let lI = new Ammo.btVector3(0,0,0);
        iPlaneBodyS.calculateLocalInertia(0,lI);
        let iPrbInfo = new Ammo.btRigidBodyConstructionInfo(0,new Ammo.btDefaultMotionState(iPT),iPlaneBodyS,lI);
        this.physicsBody = new Ammo.btRigidBody(iPrbInfo);
        let dG = new THREE.PlaneBufferGeometry(50,50,15,15);
        let aQ = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1),tN.normalize());
        dG.applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(aQ));
        tN.multiplyScalar(distance);
        dG.translate(tN.x,tN.y,tN.z);
        let debgBdy = new THREE.Mesh(dG,new THREE.MeshBasicMaterial({color:0x00ff00,wireframe:true}));
        tN.copy(normal);
        let arr = new THREE.ArrowHelper(tN.clone(),tN.multiplyScalar(distance),10);
        tN.copy(normal);
        this.debugBody = new THREE.Group();
        this.debugBody.add(arr);
        this.debugBody.add(debgBdy);
        this.mesh = new THREE.Mesh(dG,material);
    }
}
class CompoundBody extends RigidBody{
    /**
     * 
     * @param {Object} parameters
     * @param {Array<Body>} parameters.bodies
     *  
     */
    constructor(parameters){
        super();
        parameters = parameters||{};
    let bodies = parameters.bodies;
    if(bodies==undefined||!bodies instanceof Array){
        console.error('JS3DAmmo.CompoundShape: Please input an array of bodies');
        return false;
    }
    this.mesh = new THREE.Group();
    this.debugBody = new THREE.Group();
    let physicsShape = new Ammo.btCompoundShape();
    let mass = 0;
    let position = parameters.position||new Vector3();
    let rotation = parameters.rotation||parameters.quaternion||new THREE.Quaternion(0,0,0,1);
    for(var x in bodies){
        let b = bodies[x];
        let m = b.mesh;
        let d = b.debugBody;
        let t = b.physicsBody.getWorldTransform()
        let p = t.getOrigin();
        let q = t.getRotation();
        m.position.set(p.x(),p.y(),p.z())
        m.quaternion.set(q.x(),q.y(),q.z(),q.w());
        d.position.set(p.x(),p.y(),p.z());
        d.quaternion.set(q.x(),q.y(),q.z(),q.w());
        this.mesh.add(m);
        this.debugBody.add(d);
        physicsShape.addChildShape(t,bodies[x].shape.physicsBodyShape);
        mass+=b.mass;
    }
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(position.x,position.y,position.z));
    transform.setRotation(new Ammo.btQuaternion(rotation.x,rotation.y,rotation.z,rotation.w));
    this.mass = mass;
    this.gravityAffected = true;
    let ms = new Ammo.btDefaultMotionState(transform);
    let localInertia = new Ammo.btVector3(0,0,0);
    physicsShape.calculateLocalInertia(this.mass,localInertia);
    // physicsShape.setMargin(0.05);
    this.shape = physicsShape;
    this.mesh.position.copy(position);
    this.mesh.quaternion.copy(rotation);
    this.debugBody.position.copy(position);
    this.debugBody.quaternion.copy(rotation);
    let rbInfo = new Ammo.btRigidBodyConstructionInfo(this.mass,ms,physicsShape,localInertia);
    this.physicsBody = new Ammo.btRigidBody(rbInfo);
    }
}
class BoxShape extends Shape{
    /**
     * 
     * @param {Object} parameters 
     * @param {Vector3} [parameters.halfExtents]
     * @param {THREE.Material} [parameters.material]
     */
    constructor(parameters){
        super();
        this.type = 'Box';
        parameters = parameters||{};
        let halfExtents = parameters.halfExtents||new Vector3(0.5,0.5,0.5);
        this.material = parameters.material||new THREE.MeshBasicMaterial();
        this.physicsBodyShape = new Ammo.btBoxShape(new Ammo.btVector3(halfExtents.x,halfExtents.y,halfExtents.z));
        this.physicsBodyShape.setMargin(0.05);
        this.geometry = new THREE.BoxBufferGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2);
    }
}
class SphereShape extends Shape{
    /**
     * 
     * @param {Object} parameters 
     * @param {THREE.SphereBufferGeometry} [parameters.geometry]
     * @param {THREE.Material} [parameters.material]
    */
   constructor(parameters){
       super();
       this.type = 'Sphere';
        parameters = parameters||{};
        this.geometry = parameters.geometry||new THREE.SphereBufferGeometry();
        this.material = parameters.material||new THREE.MeshBasicMaterial();
        this.physicsBodyShape = new Ammo.btSphereShape(this.geometry.parameters.radius);
        this.physicsBodyShape.setMargin(0.05);

   }
}
class CylinderShape extends Shape{
    /**
     * 
     * @param {Object} parameters 
     * @param {THREE.CylinderBufferGeometry} [parameters.geometery]
     * @param {THREE.Material} [parameters.material]
     */
    constructor(parameters){
        super();
        parameters = parameters||{};
        this.type = 'Cylinder';
        this.geometry = parameters.geometry||new THREE.CylinderBufferGeometry();
        this.material = parameters.material||new THREE.MeshBasicMaterial();
        this.physicsBodyShape = new Ammo.btCylinderShape(new Ammo.btVector3(this.geometry.parameters.radiusTop,this.geometry.parameters.height/2,this.geometry.parameters.radiusTop));
        this.physicsBodyShape.setMargin(0.05);
    }
}
class Trimesh extends Shape{
    /**
     * 
     * @param {Object} parameters 
     * @param {THREE.Material} [parameters.material]
     * @param {THREE.BufferGeometry} parameters.geometery
     * @param {Boolean} [parameters.dynamic]
     */
    constructor(parameters){
        super();
        parameters = parameters||{};
    this.material = parameters.material||new THREE.MeshBasicMaterial();
    this.geometry = parameters.geometry;
    let dynamic = parameters.dynamic||false;
    if(this.geometry==undefined||!this.geometry instanceof THREE.BufferGeometry){
        console.error("JS3D.Trimesh: A geometry must be inputted to make a trimesh out of");
        return false;
    }
    if(this.geometry.index==undefined){
        console.error('JS3D.Trimesh: The geometry needs to have an index so the program knows what to make a face out of');
        return false;
    }
    let trimeshPhysicsBodyTMeshBuild = new Ammo.btTriangleMesh();
    let faces = this.geometry.index.array;
    let pos = this.geometry.attributes.position.array;
    let triPt1 = new Ammo.btVector3();
    let triPt2 = new Ammo.btVector3();
    let triPt3 = new Ammo.btVector3();
    for(let x = 0;x<faces.length;x+=3){
        triPt1.setValue(pos[faces[x]*3],pos[faces[x]*3+1],pos[faces[x]*3+2]);
        triPt2.setValue(pos[faces[x+1]*3],pos[faces[x+1]*3+1],pos[faces[x+1]*3+2]);
        triPt3.setValue(pos[faces[x+2]*3],pos[faces[x+2]*3+1],pos[faces[x+2]*3+2]);
        trimeshPhysicsBodyTMeshBuild.addTriangle(triPt1,triPt2,triPt3,true);
    }
    this.physicsBodyShape = new Ammo.btBvhTriangleMeshShape(trimeshPhysicsBodyTMeshBuild,dynamic,true);
    this.physicsBodyShape.setMargin(0.05);
    }
}
class ConeShape extends Shape{
    /**
     * 
     * @param {Object} parameters 
     * @param {THREE.ConeBufferGeometry} [parameters.geometery]
     * @param {THREE.Material} [parameters.material]
     */
    constructor(parameters){
        super();
        parameters = parameters||{};
        this.material = parameters.material||new THREE.MeshBasicMaterial();
        this.geometry = parameters.geometry||new THREE.ConeBufferGeometry();
        this.physicsBodyShape = new Ammo.btConeShape(this.geometry.parameters.radius,this.geometry.parameters.height);
        this.physicsBodyShape.setMargin(0.05);
    }
}

/**
 * 
 * @param {Object} parameters 
 * @param {Number} [parameters.width]
 * @param {Number} [parameters.height]
 * @param {Number} [parameters.widthSegments]
 * @param {Number} [parameters.heightSegments]
 */
class Plane extends Shape{
    constructor(parameters){
        super();
        parameters = parameters||{};
        let width = parameters.width||10;
        let height = parameters.height||10;
        let widthSegs = parameters.widthSegments||1;
        let heightSegs = parameters.heightSegments||1;
        let build = new Ammo.btTriangleMesh();
        build.addTriangle(new Ammo.btVector3(-width/2,0,-height/2),new Ammo.btVector3(-width/2,0,height/2),new Ammo.btVector3(width/2,0,height/2));
        build.addTriangle(new Ammo.btVector3(-width/2,0,-height/2),new Ammo.btVector3(width/2,0,-height/2),new Ammo.btVector3(width/2,0,height/2));
        this.physicsBodyShape = new Ammo.btBvhTriangleMeshShape(build,true);
        this.physicsBodyShape.setMargin(0.05);
        this.material = parameters.material||new THREE.MeshBasicMaterial({side:THREE.DoubleSide});
        this.geometry = new THREE.PlaneBufferGeometry(width,height,widthSegs,heightSegs);
        this.geometry.rotateX(-Math.PI/2);
        let debugGeo = new THREE.PlaneBufferGeometry(width,height);
        debugGeo.rotateX(-Math.PI/2);
        this.debugBody = new THREE.Mesh(debugGeo,new THREE.MeshBasicMaterial({color:0x00ff00,wireframe:true}))
    }
}
class HeightFeild extends Shape{
    /**
     * 
     * @param {Object} parameters 
     * @param {Array} parameters.heightData - can also be parameters.data
     * @param {THREE.Material} parameters.material
     */
    constructor(parameters){
        super();
        parameters = parameters||{};
        let heightData = parameters.heightData||parameters.data;
        if(heightData==undefined||!heightData instanceof Array){
            console.error('JS3D.HeightFeild: HeightData must be an array of heights');
            return false;
        }
        let maxHeight = Math.max(...heightData);
        let minHeight = Math.min(...heightData);
        let width = parameters.width;
        let height = parameters.height;    
        let size = heightData.length;
        let ptr = Ammo._malloc(4*width*height);
        let flipQuatEdges = parameters.flip||parameters.flipQuatEdges||false;
        let elemSize = parameters.elemSize||parameters.size||1;
        for(let f = 0,fMax = size;f<fMax;f++){
            Ammo.HEAPF32[(ptr>>2)+f] = heightData[f];
        }
        this.physicsBodyShape = new Ammo.btHeightfieldTerrainShape(width,height,ptr,1,minHeight,maxHeight,1,0,flipQuatEdges);
        this.physicsBodyShape.setLocalScaling(new Ammo.btVector3(elemSize,1,elemSize));
        let geo = new THREE.PlaneBufferGeometry(width*elemSize,height*elemSize,width-1,height-1);
        geo.rotateX(-Math.PI/2);
        let pts = geo.attributes.position.array;
        for ( var i = 0, j = 0, l = pts.length; i < l; i ++, j += 3 ) {
            // j + 1 because it is the y component that we modify
            pts[ j + 1 ] = heightData[ i ];
        }
        geo.computeVertexNormals();
        geo.computeFaceNormals();
        this.geometry = geo;
        this.material = parameters.material||new THREE.MeshBasicMaterial();
    }
}
class ConvexPolyhedronShape extends Shape{
    /**
     * 
     * @param {Object} parameters
     * @param {THREE.BufferGeometry} parameters.geometry
     * @param {THREE.Material} parameters.material 
     */
    constructor(parameters){
        super();
        parameters = parameters||{};
        this.material = parameters.material||new THREE.MeshBasicMaterial();
        this.geometry = parameters.geometry;
        if(this.geometry==undefined||!this.geometry instanceof THREE.BufferGeometry){
            console.error("JS3D.ConvexPolyhedron: A geometry must be inputted to make a trimesh out of");
            return false;
        }
        if(this.geometry.index==undefined){
            console.error('JS3D.ConvexPolyhedron: The geometry needs to have an index so the program knows what to make a face out of');
            return false;
        }
        let positionArr = this.geometry.attributes.position.array;
        let triPt1 = new Ammo.btVector3();
        this.physicsBodyShape = new Ammo.btConvexHullShape();
        for(let x = 0;x<positionArr.length;x+=3){
            triPt1.setValue(positionArr[x],positionArr[x+1],positionArr[x+2]);
            this.physicsBodyShape.addPoint(triPt1);
        }
        this.physicsBodyShape.setMargin(0.05);
    }
}
class CapsuleShape extends Shape{
    /**
     * 
     * @param {Object} parameters
     * @param {Number} parameters.radius
     * @param {Number} parameters.height
     * @param {Number} parameters.heightSegments
     * @param {Number} parameters.widthSegments
     * @param {THREE.Material} parameters.material
     */
    constructor(parameters){
        super();
        parameters = parameters||{};
        let rad = parameters.radius||1;
        let height = parameters.height||1;
        let material = parameters.material||new THREE.MeshBasicMaterial;
        let heightSegments = parameters.heightSegments||4;
        let widthSegments = parameters.widthSegments||12;
        this.geometry = new CapsuleBufferGeometry(rad,rad,height,widthSegments,1,heightSegments,heightSegments);
        this.material = material;
        this.physicsBodyShape = new Ammo.btCapsuleShape(rad,height);
        this.physicsBodyShape.setMargin(0.05);
    }
}
class Character extends RigidBody{
    
    /**
     * 
     * @param {Object} parameters 
     * @param {Number} [parameters.height]
     * @param {Number} [parameters.radius]
     * @param {Vector3} [parameters.position]
     * @param {THREE.Material} [parameters.material]
     * @param {Boolean} [parameters.CCD] - can also be parameters.continuousCollision
     * @param {Number} [parameters.group] - can also be parameters.collisionGroup
     * @param {Number} [parameters.mask] - can also be parameters.collisionMask
     * @param {THREE.Mesh} [parameters.model]
     */
    constructor(parameters){
        super();
        parameters = parameters||{};
        let height = parameters.height||2;
        let radius = parameters.radius||1;
        let geom = new THREE.BoxBufferGeometry(Math.sqrt((radius**2)*2),height+2*radius,Math.sqrt((radius**2)*2));
        let material = parameters.material||new THREE.MeshBasicMaterial();
        let position = parameters.position||new Vector3();
        Object.defineProperty(this,'initPosition',{value:position});
        Object.defineProperty(this,'initRotation',{value:new THREE.Quaternion(0,0,0,1)});
        Object.defineProperty(this,'gravityAffected',{value:true});
        let CCD = parameters.continuousCollision||parameters.CCD||false;
        let model = parameters.model;
        let mass;
        this.group = parameters.group||parameters.collisionGroup;
        this.mask = parameters.mask||parameters.collisionMask;
        if(parameters.mass<=0||parameters.mass==undefined){
            mass = 1;
        }else{
            mass = parameters.mass;
        }
        this.mesh = model||new THREE.Mesh(geom,material);
        this.debugBody = new THREE.Group();
        let longBand1S = new THREE.Shape();
        longBand1S.moveTo(-radius,-height/2);
        longBand1S.lineTo(-radius,height/2);
        longBand1S.absarc(0,height/2,radius,Math.PI,0,true);
        longBand1S.moveTo(radius,height/2);
        longBand1S.lineTo(radius,-height/2);
        longBand1S.absarc(0,-height/2,radius,0,Math.PI,true);
        longBand1S.lineTo(-radius,-height/2);
        let geo = new THREE.ShapeGeometry(longBand1S,20);
        let edges = new THREE.EdgesGeometry(geo);
        let longBand1 = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color:0xffffff}));
        let longBand2 = longBand1.clone();
        longBand2.rotation.y = Math.PI/2;
        this.debugBody.add(longBand1);
        this.debugBody.add(longBand2);
        for(let yV = Math.round(-height/2);yV<=Math.round(height/2);yV++){
            let geome = new THREE.CircleGeometry(radius,16);
            let cEdg = new THREE.EdgesGeometry(geome);
            let band = new THREE.LineSegments(cEdg,new THREE.LineBasicMaterial({color:0xffffff}));
            band.position.y = yV;
            band.rotation.x = Math.PI/2;
            this.debugBody.add(band);
        }
        let transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(position.x,position.y,position.z));
        transform.setRotation(new Ammo.btQuaternion(0,0,0,1));
        let ms = new Ammo.btDefaultMotionState(transform);
        this.physicsBodyShape = new Ammo.btCapsuleShape(radius,height);
        this.physicsBodyShape.setMargin(0.05);
        let localInertia = new Ammo.btVector3(0,0,0);
        this.physicsBodyShape.calculateLocalInertia(mass,localInertia);
        let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass,ms,this.physicsBodyShape,localInertia);
        this.physicsBody = new Ammo.btRigidBody(rbInfo);
        this.physicsBody.setAngularFactor(new Ammo.btVector3(0,0,0));
        this.physicsBody.setActivationState(4);
        if(CCD){
            this.physicsBody.setCcdMotionThreshold(1);
            this.physicsBody.setCcdSweptSphereRadius(height/2+radius);
        }
    }
    setShadows(cast,receive){
    this.mesh.castShadow = cast||true;
    this.mesh.receiveShadow = receive||true;
    }
}
class CharacterController{
    /**
     * 
     * @param {Object} parameters 
     * @param {Character|Body} parameters.character
     * @param {THREE.Camera} parameters.camera
     * @param {Number} [parameters.moveSpeed]
     * @param {Boolean} [parameters.fixedCam]
     * @param {Boolean} [parameters.firstPerson]
     * @param {Number} [parameters.yOffset]
     */
    constructor(parameters){
        parameters = parameters||{};
        this.character = parameters.character;
        this.camera = parameters.camera;
        this.moveSpeed = parameters.moveSpeed||10;
        this.fixedCam = parameters.fixedCam||false;
        this.firstPerson = parameters.firstPerson||false;
        this.cameraYOffset = parameters.yOffset||this.character.physicsBodyShape.getHalfHeight();
        if(this.character == undefined||!(this.character instanceof Body||this.character instanceof Character)){
            console.error("JS3D.CharacterController: Must have a JS3D.Character or JS3D.Body type");
            return false;
        }
        if(this.camera == undefined||!this.camera instanceof THREE.Camera){
            console.error("JS3D.CharacterController: Must have a THREE.Camera");
            return false;
        }
        this.moveDir = {left:false,right:false,forward:false,backward:false,ableJump:false};
        Object.defineProperties(this,{
            _camDir:{value:new THREE.Vector3()},
            _tmpTrans:{value:new Ammo.btTransform()},
            _rotatAxis:{value:new THREE.Vector3(0,1,0)},
            _moveAmt:{value:new THREE.Vector3()},
        _prevPosition:{value:new THREE.Vector3()},
        _tmpTrans:{value:new Ammo.btTransform()}
        })
        
        this._prevPosition.copy(this.character.mesh.position);
    }
    forward(){
        this.camera.getWorldDirection(this._camDir);
        this._camDir.y = 0;
        this._camDir.normalize();
        this._moveAmt.add(this._camDir);    
    }
    backward(){
        this.camera.getWorldDirection(this._camDir);
        this._camDir.y = 0;
        this._camDir.normalize();
        this._camDir.multiplyScalar(-1);
        this._moveAmt.add(this._camDir);
    }
    left(){
        this.camera.getWorldDirection(this._camDir);
        this._camDir.y = 0;
        this._camDir.normalize();
        this._camDir.applyAxisAngle(this._rotatAxis,Math.PI/2)
        this._moveAmt.add(this._camDir);
    }
    right(){
        this.camera.getWorldDirection(this._camDir);
        this._camDir.y = 0;
        this._camDir.normalize();
        this._camDir.applyAxisAngle(this._rotatAxis,-Math.PI/2)
        this._moveAmt.add(this._camDir);
    }
    /**
     * @param {Number} keyCode
     * @param {Number} forCode
     * @param {Number} backCode
     * @param {Number} rightCode
     * @param {Number} leftCode
     */
    moveDirUpdateSta(keyCode,forCode,backCode,leftCode,rightCode){
        if(keyCode==forCode){
            this.moveDir.forward = true;
        }
        if(keyCode==backCode){
            this.moveDir.backward = true;
        }
        if(keyCode==leftCode){
            this.moveDir.left = true;
        }
        if(keyCode==rightCode){
            this.moveDir.right = true;
        }
    }
    /**
     * @param {Number} keyCode
     * @param {Number} forCode
     * @param {Number} backCode
     * @param {Number} rightCode
     * @param {Number} leftCode
     */
    moveDirUpdateSto(keyCode,forCode,backCode,leftCode,rightCode){
        if(keyCode==forCode){
            this.moveDir.forward = false;
        }
        if(keyCode==backCode){
            this.moveDir.backward = false;
        }
        if(keyCode==leftCode){
            this.moveDir.left = false;
        }
        if(keyCode==rightCode){
            this.moveDir.right = false;
        }
    }
    updatePosition(){
        if(this.moveDir.forward){
            this.forward();
        }
        if(this.moveDir.backward){
            this.backward();
        }
        if(this.moveDir.left){
            this.left();
        }
        if(this.moveDir.right){
            this.right();
        }
        let ammoObj = this.character.physicsBody;
        let curVel = ammoObj.getLinearVelocity();
        this._moveAmt.multiplyScalar(this.moveSpeed);
        ammoObj.setLinearVelocity(new Ammo.btVector3(this._moveAmt.x,curVel.y(),this._moveAmt.z));
        this._moveAmt.set(0,0,0);
        if(this.firstPerson){
            let pos = ammoObj.getWorldTransform().getOrigin();
            this.camera.position.set(pos.x(),pos.y()+this.cameraYOffset,pos.z());
        };
        let curPos = ammoObj.getWorldTransform().getOrigin();
        if(!this.fixedCam){
            let dif = new THREE.Vector3(curPos.x()-this._prevPosition.x,curPos.y()-this._prevPosition.y,curPos.z()-this._prevPosition.z)
            this.camera.position.add(dif);
            this._prevPosition.set(curPos.x(),curPos.y(),curPos.z());
        }
        this.character.mesh.position.set(curPos.x(),curPos.y(),curPos.z());
        this.character.debugBody.position.copy(this.character.mesh.position);
    }
    /**
     * @param {Number} jumpVelocity
     */
    jump(jumpVelocity){
        let physicsBody = this.character.physicsBody;
        let curVel = physicsBody.getLinearVelocity();
        physicsBody.setLinearVelocity(new Ammo.btVector3(curVel.x(),jumpVelocity,curVel.z()));
    
    }
}
exports.Vector3 = Vector3;
exports.World = World;
exports.Body = Body;
exports.BoxShape = BoxShape;
exports.SphereShape = SphereShape;
exports.CylinderShape = CylinderShape;
exports.ConeShape = ConeShape;
exports.Trimesh = Trimesh;
exports.Plane = Plane;
exports.CapsuleShape = CapsuleShape;
exports.InfPlane = InfPlane;
exports.HeightFeild = HeightFeild;
exports.ConvexPolyhedronShape = ConvexPolyhedronShape;
exports.Character = Character;
exports.CharacterController = CharacterController;
exports.CompoundBody = CompoundBody;
exports.BufferGeometryUtils = BufferGeometryUtils;
exports.RigidBody = RigidBody;
exports.Shape = Shape;
})));
