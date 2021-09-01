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
    initialModel: IClusterFactoryModel;

    /**
     * A callback that allows the component to write state to an
     * external object.
     */
    stateEscapeHatch: (model: IClusterFactoryModel) => void;
  }

  /**
   * The state for the ClusterCreating component.
   */
  export interface IState {
    /**
     * The proposed cluster model shown in the scaling.
     */
    model: IClusterFactoryModel;
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
    let model: IClusterFactoryModel;
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
    let model: IClusterFactoryModel = { ...this.state.model };
    this.props.stateEscapeHatch(model);
  }

  /**
   * React to the number of workers changing.
   */
  onScaleChanged(event: React.ChangeEvent): void {
    // this.setState({
    //   model: {
    //     ...this.state.model,
    //     workers: parseInt((event.target as HTMLInputElement).value, 10)
    //   }
    // });
  }

  /**
   * React to the user selecting the adapt checkbox.
   */
  onScalingChanged(event: React.ChangeEvent): void {
    // const value = (event.target as HTMLInputElement).checked;
    // this.setState({
    //   model: this.state.model,
    //   adaptive: value
    // });
  }

  /**
   * React to the minimum slider changing. We also update the maximum
   * so that it is alway greater than or equal to the minimum.
   */
  onMinimumChanged(event: React.ChangeEvent): void {
    // const value = parseInt((event.target as HTMLInputElement).value, 10);
    // const minimum = Math.max(0, value);
    // const maximum = Math.max(this.state.model.adapt!.maximum, minimum);
    // this.setState({
    //   model: {
    //     ...this.state.model,
    //     adapt: {
    //       maximum,
    //       minimum
    //     }
    //   }
    // });
  }

  /**
   * React to the maximum slider changing. We also update the minimum
   * so that it is always less than or equal to the maximum.
   */
  onMaximumChanged(event: React.ChangeEvent): void {
    // const value = parseInt((event.target as HTMLInputElement).value, 10);
    // const maximum = Math.max(0, value);
    // const minimum = Math.min(this.state.model.adapt!.minimum, maximum);
    // this.setState({
    //   model: {
    //     ...this.state.model,
    //     adapt: {
    //       maximum,
    //       minimum
    //     }
    //   }
    // });
  }

  /**
   * Render the component..
   */
  render() {
    const model = this.state.model;
    return (
      <div>
        <span className="dask-ScalingHeader">Factory</span>
        <div className="dask-ScalingSection">
          <div className="dask-ScalingSection-item">
              Name
            <input
              className="dask-ScalingInput"
              value={model.name}
              type="text"
              // onChange={evt => {
              //   this.onScaleChanged(evt);
              // }}
            />
          </div>
          <div className="dask-ScalingSection-item">
              Module
            <input
              className="dask-ScalingInput"
              value={model.module}
              type="text"
              // onChange={evt => {
              //   this.onScaleChanged(evt);
              // }}
            />
          </div>
          <div className="dask-ScalingSection-item">
              Class
            <input
              className="dask-ScalingInput"
              value={model.class}
              type="text"
              // onChange={evt => {
              //   this.onScaleChanged(evt);
              // }}
            />
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
export function showCreatingDialog(
  model: IClusterFactoryModel
): Promise<IClusterFactoryModel> {
  let updatedModel = { ...model };
  const escapeHatch = (update: IClusterFactoryModel) => {
    updatedModel = update;
  };

  return showDialog({
    title: "Create new cluster",
    body: (
      <ClusterCreating initialModel={model} stateEscapeHatch={escapeHatch} />
    ),
    buttons: [Dialog.cancelButton(), Dialog.okButton({ label: 'CREATE' })]
  }).then(result => {
    if (result.button.accept) {
      return updatedModel;
    } else {
      return model;
    }
  });
}
