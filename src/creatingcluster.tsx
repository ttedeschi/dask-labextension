import { Dialog, showDialog } from '@jupyterlab/apputils';

import { IClusterFactoryModel } from './clusters';
import * as React from 'react';

/**
 * A namespace for ClusterCreating statics.
 */
namespace ClusterCreating {
  /**
   * The props for the ClusterCreating component.
   */

  export interface IProps {
    /**
     * The initial cluster model shown in the scaling.
     */
    initialModel: IClusterFactoryModel[];

    /**
     * A callback that allows the component to write state to an
     * external object.
     */
    stateEscapeHatch: (model: IClusterFactoryModel[]) => void;
  }

  /**
   * The state for the ClusterCreating component.
   */
  export interface IState {
    /**
     * The proposed cluster model shown in the scaling.
     */
    model: IClusterFactoryModel[];
  }
}

/**
 * A component for an HTML form that allows the user
 * to select scaling parameters.
 */
export class ClusterCreating extends React.Component<
  ClusterCreating.IProps,
  ClusterCreating.IState
> {

  /**
   * Construct a new ClusterCreating component.
   */
  constructor(props: ClusterCreating.IProps) {
    super(props);
    let model: IClusterFactoryModel[];
    // If the initial model is static, enrich it
    // with placeholder values for minimum and maximum workers.
    model = props.initialModel;

    this.state = { model };
  }

  /**
   * When the component updates we take the opportunity to write
   * the state of the cluster to an external object so this can
   * be sent as the result of the dialog.
   */
  componentDidUpdate(): void {
    let model: IClusterFactoryModel[] = { ...this.state.model };
    this.props.stateEscapeHatch(model);
  }

  onFactoryChange(event: React.ChangeEvent): void {
    console.log("onFactoryChange", event);

    let currentSelection = (event.target as HTMLInputElement).value;
    console.log("onFactoryChange", currentSelection);

    console.log("onFactoryChange", this.state)

    this.state.model.forEach((val: IClusterFactoryModel) => {
      if (val.name === currentSelection) {
        val.selected = true;
      } else {
        val.selected = false;
      }
    })

    this.setState({
      model: this.state.model,
    });
  }

  onImageChange(event: React.ChangeEvent): void {
    console.log("onFactoryChange", event);

    let currentSelection = (event.target as HTMLInputElement).value;
    console.log("onFactoryChange", currentSelection);

    console.log("onFactoryChange", this.state)

    this.state.model.forEach((val: IClusterFactoryModel) => {
        val.singularityImage = currentSelection
    })

    this.setState({
      model: this.state.model,
    });
  }

  onCoresChange(event: React.ChangeEvent): void {
    let currentCores = parseInt((event.target as HTMLInputElement).value, 10);
    this.state.model.forEach((val: IClusterFactoryModel) => {
      val.user_cores = currentCores;
    })
    this.setState({ model: this.state.model });
  }

  onMemoryChange(event: React.ChangeEvent): void { 
    let currentSelection = (event.target as HTMLInputElement).value;
    this.state.model.forEach((val: IClusterFactoryModel) => {
      val.user_memory = currentSelection;
    });
    this.setState({ model: this.state.model });
  }

  /**
   * Render the component..
   */
  render() {
    const model = this.state.model;
    console.log("render", model);
    let options = model.map((data) =>
      <option
        key={data.name}
        value={data.name}
      >
        {data.name}
      </option>
    );
    return (
      <div>
        <span className="dask-ScalingHeader">Factory</span>
        <div className="dask-ScalingSection">
          <div className="dask-ScalingSection-item">
            Name:
            <select name="customSearch" className="custom-search-select" onChange={evt => {
              this.onFactoryChange(evt);
            }}>
              <option>Select Item</option>
              {options}
            </select>
          </div>
          <div className="dask-ScalingSection-item">
              WN Image:
              <input list="ice-cream-flavors" id="ice-cream-choice" name="ice-cream-choice" onChange={evt => {
              this.onImageChange(evt);
            }}/>
            <datalist id="ice-cream-flavors">
              <option value="/cvmfs/unpacked.cern.ch/registry.hub.docker.com/dodasts/root-in-docker:ubuntu22-kernel-v1"> Base ROOT 6.27 </option>
              <option value="/cvmfs/unpacked.cern.ch/registry.hub.docker.com/dodasts/root-in-docker:ubuntu22-kernel-v1-monitoring-boost-v1-correctionlib"> RDF 6.27 + Monitoring + Boost + Correctionlib </option>
              <option value="/cvmfs/unpacked.cern.ch/ghcr.io/comp-dev-cms-ita/kernel-root:latest"> Base ROOT latest </option>
              <option value="/cvmfs/unpacked.cern.ch/ghcr.io/comp-dev-cms-ita/kernel-coffea:v0.0.5-fix5"> Base Coffea 0.7 </option>
              <option value="/cvmfs/unpacked.cern.ch/ghcr.io/comp-dev-cms-ita/kernel-mkshapesrdf:latest"> mkShapesRDF </option>
              <option value="/cvmfs/unpacked.cern.ch/ghcr.io/comp-dev-cms-ita/kernel-pocketcoffea:v0.0.5-fix5"> PocketCoffea </option>
            </datalist>
          </div>
          <div className="dask-ScalingSection-item">
            Worker Cores:
            <input type="number" min="1" max="4" onChange={evt => {
              this.onCoresChange(evt);
            }} />
          </div>
          <div className="dask-ScalingSection-item"> 
            Worker memory:
            <input list="ice-cream-flavors" id="ice-cream-choice" name="ice-cream-choice" onChange={evt => {
              this.onMemoryChange(evt);
            }}/>
            <datalist id="ice-cream-flavors">
              <option value="2 GiB"> 2 GiB </option>
              <option value="4 GiB"> 4 GiB </option>
            </datalist>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * Show a dialog for scaling a cluster model.
 *
 * @param model: the initial model.
 *
 * @returns a promse that resolves with the user-selected scalings for the
 *   cluster model. If they pressed the cancel button, it resolves with
 *   the original model.
 */
export async function showCreatingDialog(
  factories: IClusterFactoryModel[]
): Promise<IClusterFactoryModel> {
  let newModel = { ...factories };
  const escapeHatch = (update: IClusterFactoryModel[]) => {
    newModel = update;
  };

  return showDialog({
    title: "Create new cluster",
    body: (
      <ClusterCreating initialModel={factories} stateEscapeHatch={escapeHatch} />
    ),
    buttons: [Dialog.cancelButton(), Dialog.okButton({ label: 'CREATE' })]
  }).then(result => {
    console.log("showCreatingDialog", result)
    console.log("showCreatingDialog", factories)
    console.log("showCreatingDialog", newModel)
    if (result.button.accept) {
      for (let index in newModel) {
        if (newModel.hasOwnProperty(index)) {
          let curFactory = newModel[index];
          if (curFactory.selected === true) {
            return curFactory;
          }
        }
      }
      return { "name": "undefined", "selected": false, "singularityImage": "DUMMY", user_cores: 1, user_memory: "DUMMY"};
    } else {
      return { "name": "undefined", "selected": false, "singularityImage": "DUMMY", user_cores: 1, user_memory: "DUMMY"};
    }
  });
}
